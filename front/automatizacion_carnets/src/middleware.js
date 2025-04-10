import { NextResponse } from "next/server";

export function middleware(request) {

    const token = request.cookies.get('jwt')?.value;

    console.log("Token en middleware:", token);

    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        return NextResponse.next();
    }
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};