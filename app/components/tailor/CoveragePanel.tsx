'use client'

import React from 'react'
import { CoverageReport } from '../../lib/api'
import { AlertIcon, CheckIcon } from '../ui/Icons'

/**
 * What the finished PDF actually contains.
 *
 * The backend reads the text back out of the compiled PDF, so this reflects what
 * an applicant tracking system would see, not what the AI claims it did.
 */
const CoveragePanel = ({ report }: { report: CoverageReport }) => {
    const checked = report.covered.length + report.missing.length
    const percentage = checked > 0 ? Math.round((report.covered.length / checked) * 100) : 0

    return (
        <section className="panel p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="panel-title">What made it in</h2>
                {checked > 0 && (
                    <span className={`badge ${percentage >= 70 ? 'badge-success' : 'badge-warning'} badge-sm`}>
                        {report.covered.length} of {checked} skills
                    </span>
                )}
            </div>

            {report.page_count > 1 && (
                <div className="alert alert-warning mb-3 py-2 text-xs" role="alert">
                    <AlertIcon className="size-4 shrink-0" />
                    <span>
                        This came out as {report.page_count} pages. Trim a few points in{' '}
                        <span className="font-medium">My resume</span> to get back to one.
                    </span>
                </div>
            )}

            {!report.text_is_extractable && (
                <div className="alert alert-warning mb-3 py-2 text-xs" role="alert">
                    <AlertIcon className="size-4 shrink-0" />
                    <span>The text could not be read back out of this PDF, which may confuse automated screeners.</span>
                </div>
            )}

            {report.covered.length > 0 && (
                <div className="mb-3">
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-success">
                        <CheckIcon className="size-4" />
                        In your resume now
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {report.covered.map((keyword) => (
                            <span key={keyword} className="badge badge-success badge-sm badge-outline">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {report.skipped.length > 0 && (
                <div className="mb-3">
                    <p className="mb-1.5 text-xs font-medium text-base-content/60">Left out on purpose</p>
                    <ul className="space-y-1">
                        {report.skipped.map((item) => (
                            <li key={item.keyword} className="text-xs text-base-content/70">
                                <span className="font-medium">{item.keyword}</span> — {item.reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {report.missing.length > 0 && (
                <div>
                    <p className="mb-1.5 text-xs font-medium text-base-content/60">Asked for, but not in your resume</p>
                    <div className="flex flex-wrap gap-1.5">
                        {report.missing.map((keyword) => (
                            <span key={keyword} className="badge badge-ghost badge-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-base-content/50">
                        These are real gaps rather than oversights. If you do have the experience, add a point about it in{' '}
                        <span className="font-medium">My resume</span> and tailor again.
                    </p>
                </div>
            )}
        </section>
    )
}

export default CoveragePanel
