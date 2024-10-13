// sendVerificationEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Ignore self-signed certificate errors
    }
});
dotenv.config();

export default function sendVerificationEmail(user, verificationCode) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        text: `Hello ${user.name},\n\nPlease verify your email using the following code:\n
        --->   ${verificationCode}  <-----\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}
