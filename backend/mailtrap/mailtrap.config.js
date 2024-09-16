import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Nodemailer transporter setup
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com for Gmail
    port: process.env.SMTP_PORT || 587, // usually 587 or 465
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your SMTP email
        pass: process.env.SMTP_PASS, // Your SMTP password
    },
});

export const sender = {
    email: "akshaynayani@aknayani.com",
    name: "Akshay Nayani",
};
