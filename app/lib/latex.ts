import { ResumeProfile, cleanProfile } from './types'

/**
 * Builds the LaTeX resume template that the backend fills in.
 *
 * Users never see or write LaTeX — they fill in the form on /resume and this
 * turns it into the .tex file the API expects.
 *
 * The backend (resumeAI: app/services/resume_writer.py) makes three hard
 * assumptions about this file, so the layout below is deliberate:
 *
 *  1. The first 27 lines are a commented-out preamble. The backend uncomments
 *     them by stripping two characters from each ("% " -> ""), so those lines
 *     must stay exactly as they are, and every one of them must start with "% ".
 *  2. Skill lines are inserted at `line-of-first-label - 20` in the document
 *     body, so the region from \begin{document} down to \label{skillsSection}
 *     must keep its current shape and line count. Only the name and contact
 *     text vary, and each must stay on a single line.
 *  3. Every remaining \label marks one itemize block that receives the AI's
 *     bullets for one role or project, in document order. The labels must be
 *     unique: the backend looks them up with list.index(), so duplicates would
 *     all receive the first block's bullets.
 */

const PREAMBLE = [
    '% \\documentclass[11pt]{article}       % set main text size',
    '% \\usepackage[a4paper,                % set paper size to A4. change to letterpaper for US/Canadian resumes',
    '% top=0.5in,                          % specify top page margin',
    '% bottom=0.5in,                       % specify bottom page margin',
    '% left=0.5in,                         % specify left page margin',
    '% right=0.5in]{geometry}              % specify right page margin',
    '                       ',
    '% \\usepackage{XCharter}               % set font',
    '% \\usepackage[T1]{fontenc}            % output encoding',
    '% \\usepackage[utf8]{inputenc}         % input encoding',
    '% \\usepackage{enumitem}               % enable lists for bullet points: itemize and \\item',
    '% \\usepackage[hidelinks]{hyperref}    % format hyperlinks',
    '% \\usepackage{titlesec}               % enable section title customization',
    '% \\raggedright                        % disable text justification',
    '% \\pagestyle{empty}                   % disable page numbering',
    '',
    '% % ensure PDF output will be all-Unicode and machine-readable',
    '% \\input{glyphtounicode}',
    '% \\pdfgentounicode=1',
    '',
    '% % format section headings: bolding, size, white space above and below',
    '% \\titleformat{\\section}{\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule\\vspace{-6.5pt}]',
    '',
    '% % format bullet points: size, white space above and below, white space between bullets',
    '% \\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}',
    '% \\setlist[itemize]{itemsep=-2pt, leftmargin=12pt}',
    '',
    '% resume starts here',
]

/**
 * Escapes the characters that would otherwise break the LaTeX compile.
 *
 * Everything is replaced in one pass, so the backslashes this introduces are
 * never escaped a second time.
 */
const TEX_ESCAPES: Record<string, string> = {
    '\\': '\\textbackslash{}',
    '&': '\\&',
    '%': '\\%',
    $: '\\$',
    '#': '\\#',
    _: '\\_',
    '{': '\\{',
    '}': '\\}',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}',
}

export const escapeTex = (value: string): string =>
    value.replace(/"([^"]*)"/g, "``$1''").replace(/[\\&%$#_{}~^]/g, (char) => TEX_ESCAPES[char])

/** URLs go into \href, where only a few characters actually need escaping. */
const escapeUrl = (value: string): string => value.replace(/\\/g, '').replace(/([&%#])/g, '\\$1')

const withProtocol = (url: string): string => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

const displayUrl = (url: string): string => url.replace(/^https?:\/\//i, '').replace(/\/$/, '')

const link = (url: string, text?: string): string =>
    `\\href{${escapeUrl(withProtocol(url))}}{${escapeTex(text ?? displayUrl(url))}}`

const contactLine = (profile: ResumeProfile): string => {
    const parts: string[] = []

    if (profile.email) parts.push(`\\href{mailto:${escapeUrl(profile.email)}}{${escapeTex(profile.email)}}`)
    if (profile.phone) parts.push(escapeTex(profile.phone))
    if (profile.linkedin) parts.push(link(profile.linkedin))
    if (profile.github) parts.push(link(profile.github))
    if (profile.website) parts.push(link(profile.website))

    return parts.join(' | ')
}

/** One empty itemize block; the backend appends the AI's bullets into it. */
const bulletBlock = (label: string): string[] => ['\\vspace{-9pt}', '\\begin{itemize}', `  \\label{${label}}`, '', '\\end{itemize}', '']

export const buildTex = (input: ResumeProfile): string => {
    const profile = cleanProfile(input)
    const lines: string[] = [...PREAMBLE]

    // --- header: keep this block's shape, see note (2) above ---
    lines.push('\\begin{document}', '')
    lines.push('% name', `\\centerline{\\Huge ${escapeTex(profile.fullName)}}`, '')
    lines.push('\\vspace{5pt}', '')
    lines.push('% contact information', `\\centerline{${contactLine(profile)}}`, '')
    lines.push('\\vspace{-10pt}', '')
    lines.push('% skills section', '\\section*{Skills}', '\\label{skillsSection}', '', '')
    lines.push('\\vspace{-6.5pt}', '')
    // --- end of position-sensitive region ---

    // Bullet labels are numbered across roles and projects together, matching
    // the order the AI returns them in.
    let itemNumber = 0
    const nextLabel = () => `airesumeItem${++itemNumber}`

    lines.push('% experience section', '\\section*{Experience}')
    profile.experience.forEach((entry) => {
        const company = entry.companyUrl ? link(entry.companyUrl, entry.company) : escapeTex(entry.company)
        const heading = [entry.role ? `\\textbf{${escapeTex(entry.role)},}` : '', company].filter(Boolean).join(' ')
        const place = entry.location ? `${heading} -- ${escapeTex(entry.location)}` : heading
        const dates = [entry.startDate, entry.endDate].filter(Boolean).map(escapeTex).join(' -- ')

        lines.push(dates ? `${place} \\hfill ${dates} \\\\` : `${place} \\\\`)
        lines.push(...bulletBlock(nextLabel()))
    })
    lines.push('\\vspace{-18.5pt}', '')

    lines.push('% projects section', '\\section*{Projects}')
    profile.projects.forEach((entry) => {
        const name = `\\textbf{${escapeTex(entry.name)}}`
        lines.push(entry.url ? `${name} \\hfill ${link(entry.url)} \\\\` : `${name} \\\\`)
        lines.push(...bulletBlock(nextLabel()))
    })
    lines.push('\\vspace{-18.5pt}', '')

    if (profile.education.length > 0) {
        lines.push('% education section', '\\section*{Education}')
        profile.education.forEach((entry) => {
            const school = [entry.school, entry.location].filter(Boolean).map(escapeTex).join(', ')
            lines.push(
                entry.graduation
                    ? `\\textbf{${school}} \\hfill ${escapeTex(entry.graduation)} \\\\`
                    : `\\textbf{${school}} \\\\`,
            )
            if (entry.degree || entry.detail) {
                lines.push(
                    entry.detail
                        ? `${escapeTex(entry.degree)} \\hfill ${escapeTex(entry.detail)} \\\\`
                        : `${escapeTex(entry.degree)} \\\\`,
                )
            }
            lines.push('')
        })
    }

    if (profile.extras.length > 0) {
        lines.push('% awards section', '\\section*{Awards and Publications}', '\\begin{itemize}')
        profile.extras.forEach((extra) => lines.push(`  \\item ${escapeTex(extra)}`))
        lines.push('\\end{itemize}', '')
    }

    lines.push('\\end{document}', '')

    return lines.join('\n')
}

/** Number of \label tags in the generated file; the backend counts these too. */
export const texLabelCount = (profile: ResumeProfile): number => {
    const clean = cleanProfile(profile)
    return 1 + clean.experience.length + clean.projects.length
}

/**
 * Filename for the generated template. The backend rejects anything that does
 * not end in .tex, and uses the output name as a LaTeX job name, so both stay
 * within a safe character set.
 */
export const safeFileStem = (fullName: string, fallback = 'MyResume'): string => {
    const stem = fullName
        .normalize('NFKD')
        .replace(/[^A-Za-z0-9]+/g, '')
        .slice(0, 40)

    return stem || fallback
}

export const texFileName = (profile: ResumeProfile): string => `${safeFileStem(profile.fullName)}_Template.tex`

export const outputResumeName = (profile: ResumeProfile): string => `${safeFileStem(profile.fullName)}_Resume`
