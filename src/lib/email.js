import React from "react";
import nodemailer from 'nodemailer';


async function sendEmail(to, subject, text, html, cc) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })


    try {
        await transporter.sendMail({
            from: `"UntangleBI Web App" <${process.env.SMTP_USER}>`,
            cc,
            to,
            subject,
            text,
            html,

            attachments: [
                {
                    filename: 'ubi_logo.png',
                    path: `${process.env.HOST_URL}/ubi_logo.png`,
                    cid: 'ublogo@image'
                }
            ]
        });
        console.log('Email sent successfully');

        return { type: 'success', message: 'Email sent successfully.' }
    } catch (err) {
        console.log(`Error occurred while sending email : ${err}`);

        return { type: 'error', message: `Error sending email: ${err.message}` }
    }
}

export default sendEmail;
