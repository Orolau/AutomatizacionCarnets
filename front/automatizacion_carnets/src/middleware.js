import { NextResponse } from "next/server";

const { verifyToken } = require('../../../back/utils/handleJwt.js');

export async function middleware(request) {

    const token = request.cookies.get('jwt')?.value;

    console.log("Token en middleware:", token);

    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        return NextResponse.next();
    }
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        const respuestaVerify = verifyToken(token);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
    runtime: "nodejs",
};