'use client'

import React from 'react'
import { SectionCard, TextField } from '../ui/Fields'
import { AddButton, BulletList, EntryCard, listHelpers } from './Repeatable'
import {
    EducationEntry,
    ExperienceEntry,
    ProjectEntry,
    ResumeProfile,
    SkillGroup,
    emptyEducation,
    emptyExperience,
    emptyProject,
    emptySkillGroup,
} from '../../lib/types'
import { PlusIcon, TrashIcon } from '../ui/Icons'

type Patch = (patch: Partial<ResumeProfile>) => void

export const AboutSection = ({ profile, patch }: { profile: ResumeProfile; patch: Patch }) => (
    <SectionCard title="About you" description="This goes at the top of your resume.">
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            <TextField
                label="Full name"
                placeholder="Alex Morgan"
                value={profile.fullName}
                onChange={(e) => patch({ fullName: e.target.value })}
                className="sm:col-span-2"
            />
            <TextField
                label="Email"
                type="email"
                placeholder="alex@example.com"
                value={profile.email}
                onChange={(e) => patch({ email: e.target.value })}
            />
            <TextField
                label="Phone"
                optional
                placeholder="(555) 010-2030"
                value={profile.phone}
                onChange={(e) => patch({ phone: e.target.value })}
            />
            <TextField
                label="LinkedIn"
                optional
                placeholder="linkedin.com/in/alexmorgan"
                value={profile.linkedin}
                onChange={(e) => patch({ linkedin: e.target.value })}
            />
            <TextField
                label="GitHub"
                optional
                placeholder="github.com/alexmorgan"
                value={profile.github}
                onChange={(e) => patch({ github: e.target.value })}
            />
            <TextField
                label="Website"
                optional
                placeholder="alexmorgan.dev"
                value={profile.website}
                onChange={(e) => patch({ website: e.target.value })}
                className="sm:col-span-2"
            />
        </div>
    </SectionCard>
)

export const SkillsSection = ({ skills, patch }: { skills: SkillGroup[]; patch: Patch }) => {
    const list = listHelpers(skills, (next) => patch({ skills: next }))

    return (
        <SectionCard
            title="Skills"
            description="Group them the way you would say them out loud. The AI adds skills the job asks for."
            action={<AddButton label="Add a group" onClick={() => list.add(emptySkillGroup())} />}
        >
            <div className="space-y-3">
                {skills.map((group, index) => (
                    <div key={group.id} className="flex items-start gap-2">
                        <div className="grid flex-1 gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                            <TextField
                                label="Group"
                                placeholder="Languages"
                                value={group.category}
                                onChange={(e) => list.update(index, { category: e.target.value })}
                            />
                            <TextField
                                label="Skills"
                                placeholder="Python, TypeScript, SQL"
                                value={group.skills}
                                onChange={(e) => list.update(index, { skills: e.target.value })}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm mt-7 text-error"
                            onClick={() => list.remove(index)}
                            disabled={skills.length === 1}
                            aria-label="Remove this group"
                            title="Remove this group"
                        >
                            <TrashIcon className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </SectionCard>
    )
}

export const ExperienceSection = ({ experience, patch }: { experience: ExperienceEntry[]; patch: Patch }) => {
    const list = listHelpers(experience, (next) => patch({ experience: next }))

    return (
        <SectionCard
            title="Experience"
            description="Jobs, internships and co-ops. Say what you did and what changed because of it."
            action={<AddButton label="Add a role" onClick={() => list.add(emptyExperience())} />}
        >
            <div className="space-y-4">
                {experience.map((entry, index) => (
                    <EntryCard
                        key={entry.id}
                        title={entry.role || entry.company || `Role ${index + 1}`}
                        index={index}
                        total={experience.length}
                        onMove={(direction) => list.move(index, direction)}
                        onRemove={() => list.remove(index)}
                        removeLabel="Remove this role"
                    >
                        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                            <TextField
                                label="Job title"
                                placeholder="Software Engineer"
                                value={entry.role}
                                onChange={(e) => list.update(index, { role: e.target.value })}
                            />
                            <TextField
                                label="Company"
                                placeholder="Northwind Labs"
                                value={entry.company}
                                onChange={(e) => list.update(index, { company: e.target.value })}
                            />
                            <TextField
                                label="Location"
                                optional
                                placeholder="Boston, MA"
                                value={entry.location}
                                onChange={(e) => list.update(index, { location: e.target.value })}
                            />
                            <TextField
                                label="Company link"
                                optional
                                placeholder="northwindlabs.com"
                                value={entry.companyUrl}
                                onChange={(e) => list.update(index, { companyUrl: e.target.value })}
                            />
                            <TextField
                                label="Started"
                                placeholder="Jun 2023"
                                value={entry.startDate}
                                onChange={(e) => list.update(index, { startDate: e.target.value })}
                            />
                            <TextField
                                label="Ended"
                                hint="Write Present if this is your current job."
                                placeholder="Present"
                                value={entry.endDate}
                                onChange={(e) => list.update(index, { endDate: e.target.value })}
                            />
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium">What you did</p>
                            <BulletList
                                bullets={entry.bullets}
                                onChange={(bullets) => list.update(index, { bullets })}
                                placeholder="Rebuilt the billing service in Python, cutting checkout errors by 30% for 50,000 users."
                                addLabel="Add another point"
                            />
                        </div>
                    </EntryCard>
                ))}
            </div>
        </SectionCard>
    )
}

export const ProjectsSection = ({ projects, patch }: { projects: ProjectEntry[]; patch: Patch }) => {
    const list = listHelpers(projects, (next) => patch({ projects: next }))

    return (
        <SectionCard
            title="Projects"
            description="Anything you built — side projects, coursework, hackathons."
            action={<AddButton label="Add a project" onClick={() => list.add(emptyProject())} />}
        >
            <div className="space-y-4">
                {projects.map((entry, index) => (
                    <EntryCard
                        key={entry.id}
                        title={entry.name || `Project ${index + 1}`}
                        index={index}
                        total={projects.length}
                        onMove={(direction) => list.move(index, direction)}
                        onRemove={() => list.remove(index)}
                        removeLabel="Remove this project"
                    >
                        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                            <TextField
                                label="Project name"
                                placeholder="Trailmix"
                                value={entry.name}
                                onChange={(e) => list.update(index, { name: e.target.value })}
                            />
                            <TextField
                                label="Link"
                                optional
                                placeholder="github.com/alexmorgan/trailmix"
                                value={entry.url}
                                onChange={(e) => list.update(index, { url: e.target.value })}
                            />
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium">What you built</p>
                            <BulletList
                                bullets={entry.bullets}
                                onChange={(bullets) => list.update(index, { bullets })}
                                placeholder="Built a trail-finding app with Next.js and PostgreSQL, used by 800 hikers in its first month."
                                addLabel="Add another point"
                            />
                        </div>
                    </EntryCard>
                ))}
            </div>
        </SectionCard>
    )
}

export const EducationSection = ({ education, patch }: { education: EducationEntry[]; patch: Patch }) => {
    const list = listHelpers(education, (next) => patch({ education: next }))

    return (
        <SectionCard
            title="Education"
            description="Optional. Leave it out and the section disappears from your resume."
            action={<AddButton label="Add a school" onClick={() => list.add(emptyEducation())} />}
        >
            {education.length === 0 ? (
                <p className="text-sm text-base-content/55">No schools added.</p>
            ) : (
                <div className="space-y-4">
                    {education.map((entry, index) => (
                        <EntryCard
                            key={entry.id}
                            title={entry.school || `School ${index + 1}`}
                            index={index}
                            total={education.length}
                            onMove={(direction) => list.move(index, direction)}
                            onRemove={() => list.remove(index)}
                            removeLabel="Remove this school"
                        >
                            <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                                <TextField
                                    label="School"
                                    placeholder="Northeastern University"
                                    value={entry.school}
                                    onChange={(e) => list.update(index, { school: e.target.value })}
                                />
                                <TextField
                                    label="Location"
                                    optional
                                    placeholder="Boston, MA"
                                    value={entry.location}
                                    onChange={(e) => list.update(index, { location: e.target.value })}
                                />
                                <TextField
                                    label="Degree"
                                    optional
                                    placeholder="B.S. in Computer Science"
                                    value={entry.degree}
                                    onChange={(e) => list.update(index, { degree: e.target.value })}
                                />
                                <TextField
                                    label="Graduation"
                                    optional
                                    placeholder="May 2023"
                                    value={entry.graduation}
                                    onChange={(e) => list.update(index, { graduation: e.target.value })}
                                />
                                <TextField
                                    label="Extra detail"
                                    optional
                                    hint="Shown on the right, for example a GPA."
                                    placeholder="GPA: 3.8/4.0"
                                    value={entry.detail}
                                    onChange={(e) => list.update(index, { detail: e.target.value })}
                                    className="sm:col-span-2"
                                />
                            </div>
                        </EntryCard>
                    ))}
                </div>
            )}
        </SectionCard>
    )
}

export const ExtrasSection = ({ extras, patch }: { extras: string[]; patch: Patch }) => {
    const setExtras = (next: string[]) => patch({ extras: next })

    return (
        <SectionCard
            title="Awards and publications"
            description="Optional. One line each, exactly as you want it printed."
            action={<AddButton label="Add a line" onClick={() => setExtras([...extras, ''])} />}
        >
            {extras.length === 0 ? (
                <p className="text-sm text-base-content/55">Nothing added.</p>
            ) : (
                <div className="space-y-2">
                    {extras.map((extra, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <span className="mt-3.5 size-1.5 shrink-0 rounded-full bg-base-content/40" aria-hidden="true" />
                            <textarea
                                className="textarea textarea-bordered min-h-[4rem] w-full leading-relaxed"
                                rows={2}
                                placeholder="Won Best Hack at HackMIT, judged against 120 teams."
                                value={extra}
                                onChange={(e) => setExtras(extras.map((value, i) => (i === index ? e.target.value : value)))}
                            />
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm mt-1 text-error"
                                onClick={() => setExtras(extras.filter((_, i) => i !== index))}
                                aria-label="Remove this line"
                                title="Remove this line"
                            >
                                <TrashIcon className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    )
}

/** Shown when the form is completely empty, so the first screen is not blank. */
export const EmptyStart = ({ onExample, onScratch }: { onExample: () => void; onScratch: () => void }) => (
    <div className="panel p-6 text-center sm:p-10">
        <h2 className="text-xl font-semibold">Let&apos;s build your resume</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/65">
            Fill in your details once. After that, tailoring your resume to a job takes one paste and one click.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn btn-primary" onClick={onScratch}>
                <PlusIcon className="size-4" />
                Start from scratch
            </button>
            <button type="button" className="btn btn-outline" onClick={onExample}>
                Fill in an example first
            </button>
        </div>
    </div>
)
