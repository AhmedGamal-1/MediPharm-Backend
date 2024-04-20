const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: {
            name: 'MediPharm',
            address: process.env.EMAIL
        },
        to: options.email,
        subject: options.subject,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #333;">Hello there!</h1>
                <p style="font-size: 16px; color: #666;">You have received a message from MediParm:</p>
                <hr style="border: 1px solid #ccc;">
                <h2 style="color: #333;">Subject: ${options.subject}</h2>
                <p style="font-size: 16px; color: #666;">${options.message}</p>
                <p style="font-size: 14px; color: #999;">This email was sent from <b>MediParm</b>. Please do not reply to this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;
