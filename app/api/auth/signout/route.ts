import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { AUTH_COOKIE, BACKEND_URL } from '../../backendProxy'

/** Ends the session here, and tells the API too, best effort. */
export const POST = async () => {
    const token = cookies().get(AUTH_COOKIE)?.value

    if (token) {
        try {
            await fetch(`${BACKEND_URL}/auth/signOut`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                cache: 'no-store',
            })
        } catch {
            // the session is over for this browser either way
        }
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 })

    return response
}
