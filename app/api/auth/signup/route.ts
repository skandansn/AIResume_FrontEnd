import { NextResponse } from 'next/server'
import { AUTH_COOKIE, callBackend, sessionCookieOptions } from '../../backendProxy'

/** Creates the account and starts the session on this origin. */
export const POST = async (request: Request) => {
    const { email, password } = (await request.json()) as { email?: string; password?: string }

    const { ok, status, payload } = await callBackend('/auth/signUp', { email, password })

    if (!ok) return NextResponse.json(payload, { status })

    const token = (payload as { idToken?: string })?.idToken

    if (!token) {
        return NextResponse.json({ detail: 'The server did not return a session. Please try again.' }, { status: 502 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(AUTH_COOKIE, token, sessionCookieOptions)

    return response
}
