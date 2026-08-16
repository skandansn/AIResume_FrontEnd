import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')

  if (!authToken?.value) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

// Signed-in-only routes.
export const config = {
  matcher: ['/', '/resume', '/profile'],
}
