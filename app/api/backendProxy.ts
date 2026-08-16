import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * The browser talks to this app's own origin, and this forwards to the API.
 *
 * The API sets its session cookie on its own host. On Render the two live on
 * different subdomains of onrender.com, which is a public suffix, so that cookie
 * is cross-site and never reaches this app: the browser will not send it back,
 * and third party cookie blocking would drop it anyway. Proxying keeps every
 * browser request first party, so the session cookie belongs to this origin and
 * the token is attached here, server side.
 */

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const AUTH_COOKIE = 'authToken'

export const sessionCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    // http://localhost is treated as trustworthy, but stay honest about it
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // Firebase ID tokens last an hour; the session ends with them
    maxAge: 60 * 60,
}

const HOP_BY_HOP = new Set([
    'connection',
    'content-encoding',
    'content-length',
    'host',
    'keep-alive',
    'transfer-encoding',
    'set-cookie',
    'cookie',
])

/** Forwards a request to the API, carrying the caller's token as a bearer. */
export const forward = async (request: Request, path: string): Promise<NextResponse> => {
    const token = cookies().get(AUTH_COOKIE)?.value

    const headers = new Headers()
    request.headers.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
    })
    if (token) headers.set('Authorization', `Bearer ${token}`)

    // read the body as bytes so json and multipart uploads both pass through
    const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer()

    let response: Response
    try {
        response = await fetch(`${BACKEND_URL}${path}`, {
            method: request.method,
            headers,
            body,
            cache: 'no-store',
        })
    } catch {
        return NextResponse.json({ detail: 'Could not reach the server. Please try again in a moment.' }, { status: 502 })
    }

    const payload = await response.arrayBuffer()

    return new NextResponse(payload, {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
            'Cache-Control': 'no-store',
        },
    })
}

/** Calls the API and hands back the parsed body, for the auth routes. */
export const callBackend = async (path: string, body: unknown) => {
    const response = await fetch(`${BACKEND_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    })

    const text = await response.text()
    let payload: unknown = text
    try {
        payload = JSON.parse(text)
    } catch {
        // the API answers with json, but never trust that blindly
    }

    return { ok: response.ok, status: response.status, payload }
}
