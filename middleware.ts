import { NextRequest, NextResponse } from "next/server";
// import { jwt } from "./utils";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    // Middleware para las paginas de checkout 
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(session);

    if (!session) {
        const { origin, pathname } = req.nextUrl.clone();
        return NextResponse.redirect(`${origin}/auth/login?page=${pathname}`);
    }

    return NextResponse.next();

    // Verificacion de forma manual sin nextAuth
    // if (req.nextUrl.pathname.startsWith('/checkout')) {
    //     // Obtenemos el token.
    //     const token = req.cookies.get('token')?.value || '';
    //     try {
    //         // await jwt.isValidToken(token);
    //         await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
    //         return NextResponse.next();
    //     } catch (error) {
    //         const { origin, pathname } = req.nextUrl.clone();
    //         return NextResponse.redirect(`${origin}/auth/login?page=${pathname}`);
    //     }
    // }
}

// Lugares en donde queremos que se aplique este middleware
export const config = {
    matcher: ["/checkout/:path*",],
};