import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { transporter, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};


export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Welcome to Travel Company",
        html: `<p>Welcome, ${name}! Thanks for joining Travel Company.</p>`,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset success email`, error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};

export const sendPaymentConfirmationEmail = async (email, packageName, totalCost) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Payment Confirmation",
        html: `
            <p>Dear Customer,</p>
            <p>Thank you for your payment. Your booking for the package "${packageName}" has been confirmed.</p>
            <p>Total Cost: ₹${totalCost}</p>
            <p>We look forward to serving you.</p>
            <p>Best regards,</p>
            <p>The Travel Company Team</p>
        `,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Payment confirmation email sent successfully", response);
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
        throw new Error(`Error sending payment confirmation email: ${error}`);
    }
};

export const sendContactUsEmail = async (email, name) => {
    const mailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: email,
        subject: "Contact Form Submission",
        html: `<p>Thank you for contacting us, ${name}. We have received your message and will get back to you shortly.</p>`,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Contact us email sent successfully", response);
    } catch (error) {
        console.error('Error sending contact us email:', error);
        throw new Error(`Error sending contact us email: ${error}`);
    }
};
export const sendReplyEmail = async (to, subject, message) => {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to,
      subject,
      text: message,
    };
  
    await transporter.sendMail(mailOptions);
  };