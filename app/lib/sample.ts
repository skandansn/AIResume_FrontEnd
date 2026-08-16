import { ResumeProfile, newId } from './types'

/** Prefill used by "Start from an example" so the form is never a blank page. */
export const sampleProfile = (): ResumeProfile => ({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '(555) 010-2030',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: '',
    skills: [
        { id: newId(), category: 'Languages', skills: 'Python, TypeScript, Java, SQL' },
        { id: newId(), category: 'Frameworks', skills: 'React, Next.js, FastAPI, Spring Boot' },
        { id: newId(), category: 'Tools', skills: 'AWS, Docker, Git, PostgreSQL, Redis' },
    ],
    experience: [
        {
            id: newId(),
            role: 'Software Engineer',
            company: 'Northwind Labs',
            companyUrl: '',
            location: 'Boston, MA',
            startDate: 'Jun 2023',
            endDate: 'Present',
            bullets: [
                'Rebuilt the billing service in Python, cutting checkout errors by 30% for 50,000 monthly users.',
                'Added integration tests across 6 services, reducing production incidents by 25%.',
            ],
        },
        {
            id: newId(),
            role: 'Software Engineer Intern',
            company: 'Contoso',
            companyUrl: '',
            location: 'Remote',
            startDate: 'Jan 2023',
            endDate: 'May 2023',
            bullets: ['Built an internal dashboard in React that saved the support team 5 hours a week.'],
        },
    ],
    projects: [
        {
            id: newId(),
            name: 'Trailmix',
            url: 'github.com/alexmorgan/trailmix',
            bullets: ['Built a trail-finding app with Next.js and PostgreSQL, used by 800 hikers in its first month.'],
        },
    ],
    education: [
        {
            id: newId(),
            school: 'Northeastern University',
            location: 'Boston, MA',
            degree: 'B.S. in Computer Science',
            graduation: 'May 2023',
            detail: 'GPA: 3.8/4.0',
        },
    ],
    extras: ["Dean's List, 2021-2023"],
})
