'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ResumePreview from './ResumePreview'
import KeywordPicker from './KeywordPicker'
import CoveragePanel from './CoveragePanel'
import { ApiError, CoverageReport, extractKeywords, tailorResume } from '../../lib/api'
import { useToast } from '../ui/Toast'
import { AlertIcon, CheckIcon, SparkleIcon } from '../ui/Icons'

type Template = { fileName: string; label: string }

type TailorWorkspaceProps = {
    /** False until the account has a resume saved and ready to tailor. */
    ready: boolean
    templates: Template[]
    missing: string[]
    loadError?: string
    downloadName: string
    /** The user's saved resume text, used to spot skills they already list. */
    savedResumeText: string
}

const TailorWorkspace = ({ ready, templates, missing, loadError, downloadName, savedResumeText }: TailorWorkspaceProps) => {
    const router = useRouter()
    const { notify } = useToast()

    const [description, setDescription] = useState('')
    const [useAiKeywords, setUseAiKeywords] = useState(true)
    const [mustHave, setMustHave] = useState('')
    const [exclude, setExclude] = useState('')
    const [template, setTemplate] = useState(templates[0]?.fileName ?? '')
    const [url, setUrl] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)
    const [keywords, setKeywords] = useState<string[]>([])
    const [selected, setSelected] = useState<string[]>([])
    const [findingKeywords, setFindingKeywords] = useState(false)
    const [report, setReport] = useState<CoverageReport | null>(null)

    /** Skills the posting asks for that the saved resume already mentions. */
    const known = keywords.filter((keyword) => savedResumeText.toLowerCase().includes(keyword.toLowerCase()))

    const findKeywords = async () => {
        setFindingKeywords(true)

        try {
            const found = await extractKeywords(description)

            setKeywords(found)
            // pre-tick what the resume already backs up; the rest is a decision
            setSelected(found.filter((keyword) => savedResumeText.toLowerCase().includes(keyword.toLowerCase())))

            if (found.length === 0) notify('info', 'No specific skills stood out in that posting.')
        } catch (caught) {
            if (caught instanceof ApiError && caught.status === 401) {
                router.push('/auth/signin')
                return
            }

            notify('error', caught instanceof ApiError ? caught.message : 'We could not read that posting. Please try again.')
        } finally {
            setFindingKeywords(false)
        }
    }

    const toggleKeyword = (keyword: string) =>
        setSelected((current) =>
            current.includes(keyword) ? current.filter((k) => k !== keyword) : [...current, keyword],
        )

    // The PDF only exists as a blob in this tab, so release it on the way out.
    const latestUrl = useRef<string | null>(null)

    useEffect(() => {
        latestUrl.current = url
    }, [url])

    useEffect(
        () => () => {
            if (latestUrl.current) URL.revokeObjectURL(latestUrl.current)
        },
        [],
    )

    const hasKeywordInput = selected.length > 0 || mustHave.trim().length > 0
    const canGenerate = !busy && (hasKeywordInput || (useAiKeywords && description.trim().length > 0))

    const generate = async () => {
        setBusy(true)

        try {
            const result = await tailorResume({
                description,
                useAiKeywords,
                mustHave,
                exclude,
                templateName: template,
                approvedKeywords: selected,
            })

            setUrl((previous) => {
                if (previous) URL.revokeObjectURL(previous)
                return result.url
            })
            setReport(result.report)
            notify('success', 'Your tailored resume is ready.')
        } catch (caught) {
            if (caught instanceof ApiError && caught.status === 401) {
                router.push('/auth/signin')
                return
            }

            notify('error', caught instanceof ApiError ? caught.message : 'We could not build your resume. Please try again.')
        } finally {
            setBusy(false)
        }
    }

    if (!ready) return <SetupNeeded missing={missing} loadError={loadError} />

    return (
        <div className="page">
            {loadError && (
                <div className="alert alert-warning mb-4 py-3 text-sm" role="alert">
                    <AlertIcon className="size-5 shrink-0" />
                    <span>{loadError}</span>
                </div>
            )}

            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Tailor a resume</h1>
                <p className="mt-1 text-sm text-base-content/65">
                    Paste the job posting. We match your experience to what it asks for and build the PDF.
                </p>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                    <section className="panel p-4 sm:p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="step-badge">1</span>
                            <h2 className="panel-title">Paste the job posting</h2>
                        </div>
                        <textarea
                            className="textarea textarea-bordered min-h-[16rem] w-full leading-relaxed"
                            placeholder="Paste the whole posting here — the responsibilities and requirements matter most."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-base-content/50">
                            {description.trim() ? `${description.trim().split(/\s+/).length} words pasted` : 'Nothing pasted yet'}
                        </p>
                    </section>

                    <section className="panel p-4 sm:p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="step-badge">2</span>
                            <h2 className="panel-title">Confirm what you can claim</h2>
                        </div>

                        <KeywordPicker
                            keywords={keywords}
                            selected={selected}
                            known={known}
                            loading={findingKeywords}
                            onToggle={toggleKeyword}
                            onSelectAll={(all) => setSelected(all ? keywords : [])}
                            onFind={findKeywords}
                            canFind={description.trim().length > 0}
                        />
                    </section>

                    <section className="panel p-4 sm:p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="step-badge">3</span>
                            <h2 className="panel-title">Fine-tune it</h2>
                            <span className="badge badge-ghost badge-sm">optional</span>
                        </div>

                        {keywords.length === 0 && (
                            <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-box bg-base-200/60 p-3">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary toggle-sm mt-0.5"
                                    checked={useAiKeywords}
                                    onChange={(e) => setUseAiKeywords(e.target.checked)}
                                />
                                <span>
                                    <span className="block text-sm font-medium">Let the AI pick the skills for me</span>
                                    <span className="block text-xs text-base-content/60">
                                        Used only if you skip step 2. Turn it off to rely on the skills you list below.
                                    </span>
                                </span>
                            </label>
                        )}

                        <div className="space-y-3">
                            <label className="form-control">
                                <div className="label pb-1 pt-0">
                                    <span className="label-text font-medium">Skills that must appear</span>
                                </div>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="Kubernetes, Terraform"
                                    value={mustHave}
                                    onChange={(e) => setMustHave(e.target.value)}
                                />
                            </label>

                            <label className="form-control">
                                <div className="label pb-1 pt-0">
                                    <span className="label-text font-medium">Skills to leave out</span>
                                </div>
                                <input
                                    className="input input-bordered w-full"
                                    placeholder="PHP, Perl"
                                    value={exclude}
                                    onChange={(e) => setExclude(e.target.value)}
                                />
                                <div className="label pb-0 pt-1">
                                    <span className="label-text-alt text-base-content/55">
                                        Anything you would rather not be asked about in an interview.
                                    </span>
                                </div>
                            </label>

                            {templates.length > 1 && (
                                <label className="form-control">
                                    <div className="label pb-1 pt-0">
                                        <span className="label-text font-medium">Layout</span>
                                    </div>
                                    <select
                                        className="select select-bordered"
                                        value={template}
                                        onChange={(e) => setTemplate(e.target.value)}
                                    >
                                        {templates.map((option) => (
                                            <option key={option.fileName} value={option.fileName}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>
                    </section>

                    <div className="panel p-4 sm:p-6">
                        <button type="button" className="btn btn-primary btn-block" onClick={generate} disabled={!canGenerate}>
                            {busy ? <span className="loading loading-spinner loading-sm" /> : <SparkleIcon className="size-5" />}
                            {busy ? 'Building your resume…' : 'Tailor my resume'}
                        </button>
                        {!canGenerate && !busy && (
                            <p className="mt-2 text-center text-xs text-base-content/55">
                                {description.trim().length === 0
                                    ? 'Paste a job posting to get started.'
                                    : 'Tick a skill in step 2, or add one that must appear above.'}
                            </p>
                        )}
                        {canGenerate && selected.length > 0 && (
                            <p className="mt-2 text-center text-xs text-base-content/55">
                                Using the {selected.length} skill{selected.length === 1 ? '' : 's'} you ticked. Nothing else
                                will be added.
                            </p>
                        )}
                        <p className="mt-3 text-center text-xs text-base-content/50">
                            Your details come from{' '}
                            <Link href="/resume" className="link">
                                My resume
                            </Link>
                            .
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <ResumePreview
                        url={url}
                        busy={busy}
                        fileName={downloadName}
                        emptyHint="Your tailored resume will show up here. Download it before you leave — each one is built fresh and is not kept on the server."
                    />
                    {report && !busy && <CoveragePanel report={report} />}
                </div>
            </div>
        </div>
    )
}

/**
 * Two different "not ready" cases: the account did not load, or it loaded and
 * the resume is not set up yet. Only the second one gets a checklist.
 */
const SetupNeeded = ({ missing, loadError }: { missing: string[]; loadError?: string }) =>
    loadError ? <LoadFailed message={loadError} /> : <ChecklistPanel missing={missing} />

const LoadFailed = ({ message }: { message: string }) => (
    <div className="page max-w-xl">
        <div className="panel p-6 text-center sm:p-10">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-warning/15 text-warning">
                <AlertIcon className="size-6" />
            </span>
            <h1 className="mt-4 text-xl font-semibold">We could not load your account</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/65">{message}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/" className="btn btn-primary">
                    Try again
                </a>
                <Link href="/resume" className="btn btn-ghost">
                    Edit my resume
                </Link>
            </div>
        </div>
    </div>
)

const ChecklistPanel = ({ missing }: { missing: string[] }) => (
    <div className="page max-w-2xl">
        <div className="panel p-6 text-center sm:p-10">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <SparkleIcon className="size-6" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold">One quick setup step</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/65">
                Add your resume details once. After that, every job posting is one paste and one click away from a tailored PDF.
            </p>

            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
                {missing.map((item) => (
                    <li key={item} className="flex items-start gap-2 rounded-box bg-base-200/70 px-3 py-2">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-base-content/25" />
                        <span>{item}</span>
                    </li>
                ))}
                {missing.length === 0 && (
                    <li className="flex items-start gap-2">
                        <CheckIcon className="size-4 text-success" />
                        <span>Your details are ready.</span>
                    </li>
                )}
            </ul>

            <Link href="/resume" className="btn btn-primary mt-6">
                Set up my resume
            </Link>
        </div>
    </div>
)

export default TailorWorkspace
