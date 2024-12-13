'use server'
// import { getSession } from "@/lib/sessionActions";
import { cookies } from "next/headers";

// export async function fetchUserColorTheme() {
//     const session = await getSession()

//     let colorTheme;

//     if (session) {
//         colorTheme = {
//             bgColor: session.bgColor,
//             textColor: session.textColor,
//             hoverTextColor: session.textHoverColor,
//             borderColor: session.borderColor,
//             categoryColor: session.categoryTextColor,
//         };
//     } else {
//         colorTheme = {
//             bgColor: "#0f0301",
//             textColor: "#f5ebe9",
//             hoverTextColor: "#b5290f",
//             borderColor: "#4a1107",
//             categoryColor: "#ed8d7b",
//         }
//     }

//     return { session, colorTheme }
// }


export async function getMessage() {
    const message = cookies().get("ubi-temp-message")?.value;
    cookies().delete('ubi-temp-message')
    return message;
}