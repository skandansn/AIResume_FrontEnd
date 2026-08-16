import { cookies } from 'next/headers'

/** Server-side reads of the signed-in user's account. */

export type Account = {
    email?: string
    output_resume_name?: string
    resume?: { content?: string; label_count?: number }
    /** has_content is false for templates saved before the move off file storage. */
    tex_files?: { file_name: string; label_count: number; has_content?: boolean }[]
}

export type AccountResult =
    | { status: 'ok'; account: Account }
    | { status: 'unauthenticated' }
    | { status: 'error'; message: string }

export const getAccount = async (): Promise<AccountResult> => {
    const authToken = cookies().get('authToken')

    if (!authToken?.value) return { status: 'unauthenticated' }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken.value}`,
            },
            // The account changes as soon as the user saves, so never cache it.
            cache: 'no-store',
        })

        if (response.status === 401 || response.status === 403) return { status: 'unauthenticated' }

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
            const detail = (payload as { detail?: string })?.detail
            return { status: 'error', message: detail ?? 'We could not load your account right now.' }
        }

        return { status: 'ok', account: (payload ?? {}) as Account }
    } catch {
        return { status: 'error', message: 'We could not reach the server. Please try again in a moment.' }
    }
}
