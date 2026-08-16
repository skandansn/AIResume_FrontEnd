/**
 * The structured resume a user fills in through the UI.
 *
 * This is the only resume shape the UI ever shows. Everything LaTeX-related is
 * derived from it in `lib/latex.ts`, and the plain-text form the AI reads is
 * derived from it in `lib/resumeContent.ts`. Users never see either.
 */

export type SkillGroup = {
    id: string
    /** e.g. "Languages" */
    category: string
    /** e.g. "Python, TypeScript, Go" */
    skills: string
}

export type ExperienceEntry = {
    id: string
    role: string
    company: string
    companyUrl: string
    location: string
    startDate: string
    endDate: string
    /** What you did. The AI rewrites these for each job posting. */
    bullets: string[]
}

export type ProjectEntry = {
    id: string
    name: string
    url: string
    bullets: string[]
}

export type EducationEntry = {
    id: string
    school: string
    location: string
    degree: string
    /** e.g. "Dec 2025" */
    graduation: string
    /** e.g. "GPA: 3.95/4.0" */
    detail: string
}

export type ResumeProfile = {
    fullName: string
    email: string
    phone: string
    linkedin: string
    github: string
    website: string
    skills: SkillGroup[]
    experience: ExperienceEntry[]
    projects: ProjectEntry[]
    education: EducationEntry[]
    /** Awards, publications and anything else, as a flat list of lines. */
    extras: string[]
}

export const newId = (): string => Math.random().toString(36).slice(2, 10)

export const emptySkillGroup = (): SkillGroup => ({ id: newId(), category: '', skills: '' })

export const emptyExperience = (): ExperienceEntry => ({
    id: newId(),
    role: '',
    company: '',
    companyUrl: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: [''],
})

export const emptyProject = (): ProjectEntry => ({ id: newId(), name: '', url: '', bullets: [''] })

export const emptyEducation = (): EducationEntry => ({
    id: newId(),
    school: '',
    location: '',
    degree: '',
    graduation: '',
    detail: '',
})

export const emptyProfile = (): ResumeProfile => ({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    skills: [emptySkillGroup()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
    education: [],
    extras: [],
})

/** Trims the profile down to the entries that actually carry content. */
export const cleanProfile = (profile: ResumeProfile): ResumeProfile => {
    const lines = (bullets: string[]) => bullets.map((b) => b.trim()).filter(Boolean)

    return {
        ...profile,
        fullName: profile.fullName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        linkedin: profile.linkedin.trim(),
        github: profile.github.trim(),
        website: profile.website.trim(),
        skills: profile.skills
            .map((s) => ({ ...s, category: s.category.trim(), skills: s.skills.trim() }))
            .filter((s) => s.category && s.skills),
        experience: profile.experience
            .map((e) => ({
                ...e,
                role: e.role.trim(),
                company: e.company.trim(),
                companyUrl: e.companyUrl.trim(),
                location: e.location.trim(),
                startDate: e.startDate.trim(),
                endDate: e.endDate.trim(),
                bullets: lines(e.bullets),
            }))
            .filter((e) => (e.role || e.company) && e.bullets.length > 0),
        projects: profile.projects
            .map((p) => ({ ...p, name: p.name.trim(), url: p.url.trim(), bullets: lines(p.bullets) }))
            .filter((p) => p.name && p.bullets.length > 0),
        education: profile.education
            .map((e) => ({
                ...e,
                school: e.school.trim(),
                location: e.location.trim(),
                degree: e.degree.trim(),
                graduation: e.graduation.trim(),
                detail: e.detail.trim(),
            }))
            .filter((e) => e.school),
        extras: lines(profile.extras),
    }
}

export type ProfileIssue = { field: string; message: string }

/**
 * Mirrors the checks the backend makes, so users see a helpful message in the
 * form instead of a raw API error after saving.
 */
export const validateProfile = (profile: ResumeProfile): ProfileIssue[] => {
    const clean = cleanProfile(profile)
    const issues: ProfileIssue[] = []

    if (!clean.fullName) issues.push({ field: 'fullName', message: 'Add your name so it can go at the top of the resume.' })
    if (!clean.email && !clean.phone) issues.push({ field: 'email', message: 'Add at least an email or a phone number.' })
    if (clean.skills.length === 0)
        issues.push({ field: 'skills', message: 'Add at least one skill group, for example "Languages: Python, Go".' })
    if (clean.experience.length === 0)
        issues.push({ field: 'experience', message: 'Add at least one role, with at least one thing you did in it.' })
    if (clean.projects.length === 0)
        issues.push({ field: 'projects', message: 'Add at least one project, with at least one thing you built.' })

    return issues
}

/** Number of resume blocks the AI rewrites — one per role and per project. */
export const sectionItemCount = (profile: ResumeProfile): number => {
    const clean = cleanProfile(profile)
    return clean.experience.length + clean.projects.length
}
