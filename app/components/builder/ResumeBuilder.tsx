'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    AboutSection,
    EducationSection,
    EmptyStart,
    ExperienceSection,
    ExtrasSection,
    ProjectsSection,
    SkillsSection,
} from './ResumeSections'
import { ApiError, updateOutputResumeName, updateResumeContent, uploadTemplate } from '../../lib/api'
import { buildTex, outputResumeName, texFileName } from '../../lib/latex'
import { buildResumeContent, parseResumeContent } from '../../lib/resumeContent'
import { downloadProfile, loadProfile, readProfileFile, saveProfile } from '../../lib/profileStorage'
import { sampleProfile } from '../../lib/sample'
import { ProfileIssue, ResumeProfile, emptyProfile, validateProfile } from '../../lib/types'
import { useToast } from '../ui/Toast'
import { AlertIcon, CheckIcon, DownloadIcon, SparkleIcon } from '../ui/Icons'

type ResumeBuilderProps = {
    /** The resume text already on the account, if any. */
    savedContent?: string
    loadError?: string
}

const ResumeBuilder = ({ savedContent, loadError }: ResumeBuilderProps) => {
    const router = useRouter()
    const { notify } = useToast()
    const importRef = useRef<HTMLInputElement>(null)

    const [profile, setProfile] = useState<ResumeProfile | null>(null)
    const [started, setStarted] = useState(false)
    const [issues, setIssues] = useState<ProfileIssue[]>([])
    const [saving, setSaving] = useState(false)
    const [recovered, setRecovered] = useState(false)

    // The form lives in this browser; the account only stores what the API needs.
    // Prefer the local copy, and otherwise rebuild what the saved text can give us.
    useEffect(() => {
        const local = loadProfile()

        if (local) {
            setProfile(local)
            setStarted(true)
            return
        }

        if (savedContent) {
            setProfile(parseResumeContent(savedContent))
            setStarted(true)
            setRecovered(true)
            return
        }

        setProfile(emptyProfile())
    }, [savedContent])

    useEffect(() => {
        if (profile && started) saveProfile(profile)
    }, [profile, started])

    const patch = (update: Partial<ResumeProfile>) => setProfile((current) => (current ? { ...current, ...update } : current))

    const begin = (next: ResumeProfile) => {
        setProfile(next)
        setStarted(true)
    }

    const liveIssues = useMemo(() => (profile ? validateProfile(profile) : []), [profile])

    const save = async () => {
        if (!profile) return

        const found = validateProfile(profile)
        setIssues(found)

        if (found.length > 0) {
            notify('error', 'A few details are still missing. See the list at the top.')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        setSaving(true)

        try {
            // The resume text and the template must agree on how many blocks
            // there are, so they are always saved together.
            await updateResumeContent(buildResumeContent(profile))
            await uploadTemplate(texFileName(profile), buildTex(profile))
            await updateOutputResumeName(outputResumeName(profile))

            saveProfile(profile)
            notify('success', 'Your resume is saved. Now paste a job posting.')
            router.push('/')
        } catch (caught) {
            if (caught instanceof ApiError && caught.status === 401) {
                router.push('/auth/signin')
                return
            }

            notify('error', caught instanceof ApiError ? caught.message : 'We could not save your resume. Please try again.')
            setSaving(false)
        }
    }

    const importProfile = async (file?: File) => {
        if (!file) return

        try {
            begin(await readProfileFile(file))
            notify('success', 'Your details are loaded. Check them over, then save.')
        } catch {
            notify('error', 'That file could not be read. Pick a file exported from AIResume.')
        }
    }

    if (!profile) {
        return (
            <div className="page">
                <div className="panel flex items-center gap-3 p-6">
                    <span className="loading loading-spinner loading-sm" />
                    <span className="text-sm text-base-content/70">Loading your details…</span>
                </div>
            </div>
        )
    }

    if (!started) {
        return (
            <div className="page max-w-3xl">
                {loadError && <LoadErrorNotice message={loadError} />}
                <EmptyStart onExample={() => begin(sampleProfile())} onScratch={() => setStarted(true)} />
                <p className="mt-4 text-center text-sm text-base-content/60">
                    Already exported your details from another device?{' '}
                    <button type="button" className="link link-primary" onClick={() => importRef.current?.click()}>
                        Import the file
                    </button>
                </p>
                <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => importProfile(e.target.files?.[0])}
                />
            </div>
        )
    }

    return (
        <div className="page max-w-4xl pb-28">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">My resume</h1>
                <p className="mt-1 text-sm text-base-content/65">
                    Write it once in plain English. Every tailored resume is built from what you put here.
                </p>
            </header>

            {loadError && <LoadErrorNotice message={loadError} />}

            {recovered && (
                <div className="alert mb-4 border-base-300 bg-base-100 py-3 text-sm" role="status">
                    <SparkleIcon className="size-5 shrink-0 text-primary" />
                    <span>
                        We filled in your skills and bullet points from your saved resume. Job titles, dates and links are kept on
                        the device you first used, so add them again here if they are missing.
                    </span>
                </div>
            )}

            {issues.length > 0 && (
                <div className="alert alert-warning mb-4 items-start py-3 text-sm" role="alert">
                    <AlertIcon className="size-5 shrink-0" />
                    <div>
                        <p className="font-medium">Add these before saving:</p>
                        <ul className="mt-1 list-inside list-disc space-y-0.5">
                            {issues.map((issue) => (
                                <li key={issue.field}>{issue.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <AboutSection profile={profile} patch={patch} />
                <SkillsSection skills={profile.skills} patch={patch} />
                <ExperienceSection experience={profile.experience} patch={patch} />
                <ProjectsSection projects={profile.projects} patch={patch} />
                <EducationSection education={profile.education} patch={patch} />
                <ExtrasSection extras={profile.extras} patch={patch} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-base-content/60">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadProfile(profile)}>
                    <DownloadIcon className="size-4" />
                    Export my details
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => importRef.current?.click()}>
                    Import from a file
                </button>
                <span>Use these to move your details to another computer.</span>
                <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => importProfile(e.target.files?.[0])}
                />
            </div>

            <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm text-base-content/65">
                        {liveIssues.length === 0 ? (
                            <>
                                <CheckIcon className="size-4 text-success" />
                                Everything needed is filled in.
                            </>
                        ) : (
                            <>
                                <AlertIcon className="size-4 text-warning" />
                                {liveIssues.length} thing{liveIssues.length === 1 ? '' : 's'} still to fill in.
                            </>
                        )}
                    </p>
                    <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                        {saving && <span className="loading loading-spinner loading-sm" />}
                        {saving ? 'Saving…' : 'Save my resume'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const LoadErrorNotice = ({ message }: { message: string }) => (
    <div className="alert alert-warning mb-4 py-3 text-sm" role="alert">
        <AlertIcon className="size-5 shrink-0" />
        <span>{message} You can still edit your details here and save when the connection is back.</span>
    </div>
)

export default ResumeBuilder
