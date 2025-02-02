import { NextResponse } from 'next/server'
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    // Get token from cookies
    const token = request.cookies.get('token')?.value

    // Protected routes that require authentication
    const protectedRoutes = ['/registration', '/', '/campers']
    const isProtectedRoute = protectedRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
    )

    // If accessing protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect to /campers if user is logged in and tries to access root path
    // if (request.nextUrl.pathname === '/' && token) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    // Allow the request to continue
    return NextResponse.next()
}

// Configure which routes should be handled by this middleware
export const config = {
    matcher: [
        '/registration/:path*',
        '/campers/:path*',
    ]
}
