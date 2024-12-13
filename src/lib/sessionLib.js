
export const defaultSession = {
    isLoggedIn: false,
};

export const sessionOptions = {
    password: process.env.SECRET_KEY,
    cookieName: "ubi-session",
    ttl: 86400,
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400 - 60,
        path: "/",
    }
}