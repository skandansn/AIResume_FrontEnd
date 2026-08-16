/**
 * Browser-side calls to the API, made through this app's own /api routes.
 *
 * They are never sent to the API's host directly: its session cookie belongs to
 * that host, so on separate domains the browser would neither store nor return
 * it. Going through our own origin keeps the session first party, and means
 * there is no CORS involved at all.
 */

const BASE_URL = '/api'

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

const friendlyMessage = (payload: unknown, status: number): string => {
    const detail = (payload as { detail?: unknown })?.detail

    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string }
        if (first?.msg) return first.msg
    }
    if (typeof payload === 'string' && payload.trim()) return payload
    if (status === 401) return 'Your session expired. Please sign in again.'
    if (status >= 500) return 'The server had a problem. Please try again in a moment.'

    return 'Something went wrong. Please try again.'
}

type RequestOptions = {
    method?: 'GET' | 'POST'
    body?: unknown
    /** Sends FormData instead of JSON. */
    form?: FormData
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, form } = options

    let response: Response
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: form ? undefined : { 'Content-Type': 'application/json' },
            body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
            credentials: 'same-origin',
        })
    } catch {
        throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
    }

    const text = await response.text()
    let payload: unknown = text
    try {
        payload = JSON.parse(text)
    } catch {
        // Some endpoints return a bare string; keep the raw text.
    }

    if (!response.ok) throw new ApiError(friendlyMessage(payload, response.status), response.status)

    return payload as T
}

// the auth routes are handled by this app, which turns the API's token into a
// session cookie on this origin
export const signIn = (email: string, password: string) =>
    request<unknown>('/auth/signin', { method: 'POST', body: { email, password } })

export const signUp = (email: string, password: string) =>
    request<unknown>('/auth/signup', { method: 'POST', body: { email, password } })

export const signOut = () => request<unknown>('/auth/signout', { method: 'POST' })

export const updateOutputResumeName = (resume_name: string) =>
    request<unknown>('/account/updateOutputResumeName', { method: 'POST', body: { resume_name } })

export const updateResumeContent = (resume_content: string) =>
    request<unknown>('/account/updateResumeContent', { method: 'POST', body: { resume_content } })

export const uploadTemplate = (fileName: string, tex: string) => {
    const form = new FormData()
    form.append('input_tex', new File([tex], fileName, { type: 'application/x-tex' }))

    return request<string>('/account/updateInputTex', { method: 'POST', form })
}

export type TailorOptions = {
    description: string
    /** Let the AI pick keywords from the job posting. */
    useAiKeywords: boolean
    mustHave: string
    exclude: string
    templateName: string
    /** Skills the user confirmed they can claim. Empty means let the AI choose. */
    approvedKeywords: string[]
}

export type SkippedKeyword = { keyword: string; reason: string }

/** What actually landed in the finished PDF, checked against the PDF itself. */
export type CoverageReport = {
    covered: string[]
    missing: string[]
    skipped: SkippedKeyword[]
    page_count: number
    text_is_extractable: boolean
}

export type TailorResult = {
    /** Blob URL for the PDF. The caller owns it and should revoke it. */
    url: string
    fileName: string
    report: CoverageReport
}

/** The skills a job posting screens for, in priority order. */
export const extractKeywords = async (description: string): Promise<string[]> => {
    const result = await request<{ keywords?: string[] }>('/keywordsInjections/extractKeywords', {
        method: 'POST',
        body: { description },
    })

    return result?.keywords ?? []
}

const pdfBlobUrl = (base64: string): string => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)

    return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}

/**
 * Asks the API for a tailored resume. The PDF travels in the response together
 * with a report of what made it in, so nothing is stored server side. The
 * returned blob URL belongs to the caller, who should revoke it.
 */
export const tailorResume = async (options: TailorOptions): Promise<TailorResult> => {
    const keywords: Record<string, string | boolean> = { optional_keywords: options.useAiKeywords }

    if (options.mustHave.trim()) keywords.mandatory_keywords = options.mustHave.trim()
    if (options.exclude.trim()) keywords.ignore_keywords = options.exclude.trim()

    const result = await request<{ file_name?: string; pdf_base64?: string; report?: CoverageReport }>(
        '/keywordsInjections/jobDescription',
        {
            method: 'POST',
            body: {
                description: options.description,
                keywords,
                resume_name: options.templateName,
                approved_keywords: options.approvedKeywords.length > 0 ? options.approvedKeywords : null,
            },
        },
    )

    if (!result?.pdf_base64) throw new ApiError('The server returned an empty resume. Please try again.', 502)

    return {
        url: pdfBlobUrl(result.pdf_base64),
        fileName: result.file_name ?? 'resume.pdf',
        report: result.report ?? { covered: [], missing: [], skipped: [], page_count: 0, text_is_extractable: true },
    }
}
