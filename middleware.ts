// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const authToken = request.cookies.get('authToken');

//   if (!authToken) {
//     // Redirect to /signin if the token is not present
//     return NextResponse.redirect(new URL('/auth/signin', request.url));
//   }

//   // Continue to the next middleware or page
//   return NextResponse.next();
// }

// // Specify paths to protect
// export const config = {
//   matcher: ['/', '/profile'], // Change this to match your protected routes
// };
