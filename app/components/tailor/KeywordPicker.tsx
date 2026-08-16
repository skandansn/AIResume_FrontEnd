'use client'

import React from 'react'
import { SparkleIcon } from '../ui/Icons'

/**
 * The skills the posting screens for, for the user to confirm.
 *
 * Nothing gets written into a resume unless it is ticked here, which is what
 * keeps the tailored resume something the user can defend in an interview.
 */
const KeywordPicker = ({
    keywords,
    selected,
    known,
    loading,
    onToggle,
    onSelectAll,
    onFind,
    canFind,
}: {
    keywords: string[]
    selected: string[]
    /** Keywords that already appear somewhere in the user's saved resume. */
    known: string[]
    loading: boolean
    onToggle: (keyword: string) => void
    onSelectAll: (all: boolean) => void
    onFind: () => void
    canFind: boolean
}) => {
    if (keywords.length === 0) {
        return (
            <div className="rounded-box bg-base-200/60 p-4 text-center">
                <p className="text-sm text-base-content/70">
                    See what this job is really asking for, and choose what you can honestly claim.
                </p>
                <button type="button" className="btn btn-outline btn-sm mt-3" onClick={onFind} disabled={!canFind || loading}>
                    {loading ? <span className="loading loading-spinner loading-xs" /> : <SparkleIcon className="size-4" />}
                    {loading ? 'Reading the posting…' : 'Find the skills in this posting'}
                </button>
                {!canFind && !loading && (
                    <p className="mt-2 text-xs text-base-content/50">Paste the posting above first.</p>
                )}
            </div>
        )
    }

    const allSelected = selected.length === keywords.length

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-base-content/70">
                    Tick what you can back up in an interview.{' '}
                    <span className="text-base-content/50">Anything unticked is left out.</span>
                </p>
                <div className="flex items-center gap-1">
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => onSelectAll(!allSelected)}>
                        {allSelected ? 'Clear all' : 'Select all'}
                    </button>
                    <button type="button" className="btn btn-ghost btn-xs" onClick={onFind} disabled={loading}>
                        {loading ? <span className="loading loading-spinner loading-xs" /> : 'Refresh'}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => {
                    const isSelected = selected.includes(keyword)
                    const isKnown = known.includes(keyword)

                    return (
                        <label
                            key={keyword}
                            className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                                isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-base-300 bg-base-100 text-base-content/70 hover:border-base-content/30'
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-xs"
                                checked={isSelected}
                                onChange={() => onToggle(keyword)}
                            />
                            <span>{keyword}</span>
                            {isKnown && (
                                <span className="badge badge-ghost badge-sm" title="Already on your resume">
                                    on yours
                                </span>
                            )}
                        </label>
                    )
                })}
            </div>

            <p className="mt-3 text-xs text-base-content/50">
                {selected.length} of {keywords.length} selected. Ones marked &quot;on yours&quot; were ticked for you because
                they already appear in your resume.
            </p>
        </div>
    )
}

export default KeywordPicker
