import { NextRequest } from 'next/server'
import { forward } from '../backendProxy'

/** Everything except the auth routes is passed straight through to the API. */

export const dynamic = 'force-dynamic'

const handler = (request: NextRequest, { params }: { params: { path: string[] } }) => {
    const search = request.nextUrl.search

    return forward(request, `/${params.path.join('/')}${search}`)
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
