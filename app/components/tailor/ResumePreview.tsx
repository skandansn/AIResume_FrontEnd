'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { ChevronDownIcon, ChevronUpIcon, DocumentIcon, DownloadIcon, ExternalIcon } from '../ui/Icons'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

type ResumePreviewProps = {
    url: string | null
    /** True while a new PDF is being generated. */
    busy: boolean
    /** Copy shown before anything has been generated. */
    emptyHint: string
    /** Name to save the download as. */
    fileName: string
}

/** The PDF is already a local blob, so it can be saved straight from the URL. */
const savePdf = (url: string, fileName: string) => {
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = fileName
    anchor.click()
}

const ResumePreview = ({ url, busy, emptyHint, fileName }: ResumePreviewProps) => {
    const holder = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(1)
    const [failed, setFailed] = useState(false)

    // react-pdf renders to a fixed-size canvas, so it needs the pixel width.
    useEffect(() => {
        const element = holder.current
        if (!element) return

        const measure = () => setWidth(element.clientWidth)
        measure()

        const observer = new ResizeObserver(measure)
        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        setPage(1)
        setFailed(false)
    }, [url])

    const turn = (delta: number) => setPage((current) => Math.min(Math.max(current + delta, 1), pageCount || 1))

    return (
        <div className="panel flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 p-3">
                <h2 className="panel-title px-1">Your resume</h2>
                {url && (
                    <div className="flex items-center gap-2">
                        <a href={url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                            <ExternalIcon className="size-4" />
                            Open
                        </a>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => savePdf(url, fileName)}>
                            <DownloadIcon className="size-4" />
                            Download PDF
                        </button>
                    </div>
                )}
            </div>

            <div ref={holder} className="preview-scroll relative min-h-[26rem] flex-1 overflow-auto bg-base-200 p-3">
                {busy && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-base-200/85 text-center">
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <div>
                            <p className="font-medium">Writing your resume…</p>
                            <p className="mt-1 text-sm text-base-content/60">This usually takes 20 to 40 seconds.</p>
                        </div>
                    </div>
                )}

                {!url && !busy && (
                    <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center">
                        <DocumentIcon className="size-10 text-base-content/25" />
                        <p className="max-w-xs text-sm text-base-content/60">{emptyHint}</p>
                    </div>
                )}

                {url && failed && (
                    <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 px-6 text-center">
                        <p className="text-sm text-base-content/70">The preview could not load in the browser.</p>
                        <a href={url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                            <ExternalIcon className="size-4" />
                            Open the PDF in a new tab
                        </a>
                    </div>
                )}

                {url && !failed && width > 0 && (
                    <Document
                        key={url}
                        file={url}
                        onLoadSuccess={({ numPages }) => setPageCount(numPages)}
                        onLoadError={() => setFailed(true)}
                        loading={
                            <div className="flex h-96 items-center justify-center">
                                <span className="loading loading-spinner loading-md text-primary" />
                            </div>
                        }
                        error={<></>}
                        className="flex justify-center"
                    >
                        <Page
                            pageNumber={page}
                            width={Math.max(width - 24, 240)}
                            renderTextLayer={false}
                            className="shadow-md"
                        />
                    </Document>
                )}
            </div>

            {url && !failed && pageCount > 1 && (
                <div className="flex items-center justify-center gap-3 border-t border-base-300 p-2 text-sm">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => turn(-1)} disabled={page === 1}>
                        <ChevronUpIcon className="size-4" />
                        Previous
                    </button>
                    <span className="text-base-content/60">
                        Page {page} of {pageCount}
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => turn(1)} disabled={page === pageCount}>
                        Next
                        <ChevronDownIcon className="size-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ResumePreview
