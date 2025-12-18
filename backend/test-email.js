require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log("Testing email with user:", process.env.EMAIL_USER);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Verifying connection...");
        await transporter.verify();
        console.log("SUCCESS: Email configuration is valid!");
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Email configuration is invalid.");
        console.error(error);
        process.exit(1);
    }
};

testEmail();
