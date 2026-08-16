import { ResumeProfile, cleanProfile, emptyExperience, emptyProfile, newId } from './types'

/**
 * The plain-text form of the resume that the AI reads and rewrites.
 *
 * The backend splits this on the section markers below, then splits Experience
 * and Projects into blocks on blank lines, dropping the first line of each
 * block as a heading (resumeAI: app/services/resume_writer.py). So each block
 * must be: one heading line, then one line per bullet, then a blank line.
 *
 * Skill lines must be "Category: values" — the backend splits them on the
 * first colon and silently drops any line without one.
 */

const SECTIONS = {
    skills: ['SkillsSectionStart', 'SkillsSectionEnd'],
    experience: ['ExperienceSectionStart', 'ExperienceSectionEnd'],
    projects: ['ProjectsSectionStart', 'ProjectsSectionEnd'],
} as const

/**
 * The AI copies most of this text straight through, and the backend pastes the
 * result into LaTeX while only escaping "%" itself. So the characters LaTeX
 * chokes on are escaped here instead:
 *
 *  - an unpaired "$" (as in "$2M") makes the backend's TexSoup parse fail
 *  - "&", "#", "_", "{", "}", "^" and "~" break or distort the PDF compile
 *  - "%" is left alone, because the backend escapes it and would otherwise
 *    turn an already-escaped "\%" into a stray line break
 */
const texSafeText = (value: string): string =>
    value
        .replace(/\\/g, '/')
        .replace(/([&$#_{}])/g, '\\$1')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')

/** Blank lines separate blocks, so bullets are collapsed onto single lines. */
const oneLine = (value: string): string => texSafeText(value.replace(/\s+/g, ' ').trim())

const block = (heading: string, bullets: string[]): string => [heading, ...bullets.map(oneLine)].join('\n')

export const buildResumeContent = (input: ResumeProfile): string => {
    const profile = cleanProfile(input)

    const skills = profile.skills.map((group) => `${oneLine(group.category)}: ${oneLine(group.skills)}`)

    const experience = profile.experience.map((entry) =>
        block(`${[entry.company, entry.role].filter(Boolean).map(oneLine).join(' - ')}:`, entry.bullets),
    )

    const projects = profile.projects.map((entry) => block(`${oneLine(entry.name)}:`, entry.bullets))

    return [
        SECTIONS.skills[0],
        '',
        skills.join('\n'),
        '',
        SECTIONS.skills[1],
        '',
        SECTIONS.experience[0],
        '',
        experience.join('\n\n'),
        '',
        SECTIONS.experience[1],
        '',
        SECTIONS.projects[0],
        '',
        projects.join('\n\n'),
        '',
        SECTIONS.projects[1],
        '',
    ].join('\n')
}

/** Reverse of `texSafeText`, so the form shows what the user actually typed. */
const plainText = (value: string): string =>
    value
        .replace(/\\textasciitilde\{\}/g, '~')
        .replace(/\\textasciicircum\{\}/g, '^')
        .replace(/\\([&$#_{}%])/g, '$1')
        .trim()

const sectionLines = (lines: string[], start: string, end: string): string[] => {
    const from = lines.findIndex((line) => line.includes(start))
    const to = lines.findIndex((line) => line.includes(end))

    if (from === -1 || to === -1 || to < from) return []

    return lines.slice(from + 1, to)
}

/** Splits a section into blocks of [heading, ...bullets] on blank lines. */
const sectionBlocks = (lines: string[]): string[][] => {
    const blocks: string[][] = []
    let current: string[] = []

    lines.forEach((line) => {
        if (line.trim() === '') {
            if (current.length > 0) blocks.push(current)
            current = []
        } else {
            current.push(line.trim())
        }
    })
    if (current.length > 0) blocks.push(current)

    return blocks
}

/**
 * Reads a saved resume back out of the stored text.
 *
 * The stored text only holds skills and bullets — job titles, dates, links and
 * education live in the generated template, which the API does not hand back.
 * So this recovers what it can, and the rest of the form starts empty.
 */
export const parseResumeContent = (content: string): ResumeProfile => {
    const profile = emptyProfile()
    const lines = content.split('\n')

    const skills = sectionLines(lines, ...SECTIONS.skills)
        .map((line) => line.trim())
        .filter((line) => line.includes(':'))
        .map((line) => {
            const [category, ...rest] = line.split(':')
            return { id: newId(), category: plainText(category), skills: plainText(rest.join(':')) }
        })

    const experience = sectionBlocks(sectionLines(lines, ...SECTIONS.experience)).map(([heading, ...bullets]) => {
        const [company, role] = heading.replace(/:$/, '').split(' - ')
        return {
            ...emptyExperience(),
            role: plainText(role ?? ''),
            company: plainText(company ?? ''),
            bullets: bullets.length > 0 ? bullets.map(plainText) : [''],
        }
    })

    const projects = sectionBlocks(sectionLines(lines, ...SECTIONS.projects)).map(([heading, ...bullets]) => ({
        id: newId(),
        name: plainText(heading.replace(/:$/, '')),
        url: '',
        bullets: bullets.length > 0 ? bullets.map(plainText) : [''],
    }))

    if (skills.length > 0) profile.skills = skills
    if (experience.length > 0) profile.experience = experience
    if (projects.length > 0) profile.projects = projects

    return profile
}

/** True when the account already has a resume stored. */
export const hasStoredResume = (content?: string | null): boolean =>
    typeof content === 'string' && content.includes(SECTIONS.skills[0])
