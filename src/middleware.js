import { NextResponse } from "next/server";
import { getSession } from "./lib/sessionActions";

export async function middleware(req) {
    // console.log("In middleware: ", req.url);

    const url = req.nextUrl.clone();

    // // Bypass middleware for static assets (like images, CSS, JS, etc.)
    const isPublicFile = url.pathname.startsWith('/_next') || url.pathname.startsWith('/img') || url.pathname.startsWith('/favicon.ico') || /\.(png|jpg|jpeg|gif|svg)$/.test(url.pathname);

    if (isPublicFile) {
        return NextResponse.next();
    }


    const { pathname } = req.nextUrl;

    let sessionExists = false

    // Fetch session from Iron session
    const session = await getSession();
    if (Object.keys(session).length > 0) {
        sessionExists = true
    }

    // Redirect authenticated users away from the login page to the dashboard
    if (sessionExists && pathname === '/login') {
        // console.log("chk1");

        const redirectUrl = new URL("/dashboard", req.url);
        redirectUrl.searchParams.set('log', 'true')

        return NextResponse.redirect(redirectUrl)
        // return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If no session exists and the user is trying to access a protected route
    if (!sessionExists && pathname !== '/login') {
        // console.log("chk2: ", sessionExists, " - ", pathname);
        const redirectUrl = new URL("/login", req.url)
        redirectUrl.searchParams.set('no-access', 'true')

        return NextResponse.redirect(redirectUrl)
        // return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!session.isAdmin) {
        // validate dashboard menus
        const menus = session.menus
        const isAllowedDashboardMenu = menus ? menus.some(menu => `/dashboard/${menu.id}` === pathname) : []

        // Allow access to all ticket routes
        const isTicketRoute = pathname.startsWith('/dashboard/ticket');

        // validate other allowed menus
        const otherMenus = [`/dashboard/profile/${session.userId}`, "/dashboard", "/dashboard/selfPasswordReset", '/dashboard/userNotification']
        const isAllowedOtherMenu = otherMenus.some(menu => menu === pathname)

        if (!isAllowedDashboardMenu && !isAllowedOtherMenu && !isTicketRoute) {
            const response = NextResponse.redirect(new URL(("/dashboard", req.nextUrl.origin + '/dashboard')))

            // // set cookie to pass message
            // response.cookies.set('ubi-temp-message', 'You are not allowed to access this page. Please contact administrator.', {
            //     path: '/',
            //     httpOnly: true,
            //     sameSite: 'none', // Set SameSite attribute
            //     secure: process.env.NODE_ENV === 'production', // Set Secure attribute for production
            //     maxAge: 10 // Cookie expiry time
            // });

            // console.log("Response Cookies: ", response.cookies.getAll());

            return response
        }

    }



    // Allow other pages to proceed
    return NextResponse.next();

}


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|verify|reset-password|forgot-password|login|change-password|resetPassword|authenticator|mfa-authenticate).*)',
    ],

}

