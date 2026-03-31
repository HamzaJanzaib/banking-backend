require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Banking App" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendRegistrationEmail = async (to, name) => {
    const subject = 'Welcome to Our Banking App!';
    const text = `Hi ${name},\n\nThank you for registering with our banking app! We're excited to have you on board.\n\nBest regards,\nThe Banking App Team`;
    const html = `<p>Hi ${name},</p><p>Thank you for registering with our banking app! We're excited to have you on board.</p><p>Best regards,<br>The Banking App Team</p>`;
    await sendEmail(to, subject, text, html);
};

const sendAccountCreationEmail = async (to, name) => {
    const subject = 'Your New Account Has Been Created!';
    const text = `Hi ${name},\n\nYour new account has been successfully created! You can now start using our banking services.\n\nBest regards,\nThe Banking App Team`;
    const html = `<p>Hi ${name},</p><p>Your new account has been successfully created! You can now start using our banking services.</p><p>Best regards,<br>The Banking App Team</p>`;
    await sendEmail(to, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendAccountCreationEmail
};