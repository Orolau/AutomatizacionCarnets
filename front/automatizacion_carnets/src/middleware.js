import { NextResponse } from "next/server";

export async function middleware(request) {

    const token = request.cookies.get('jwt')?.value;

    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        return NextResponse.next();
    }
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const res = await fetch("http://localhost:3005/api/auth/verifyToken", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (res.status !== 200) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};