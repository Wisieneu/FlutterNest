import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'SendinBlue',
  auth: {
    user: process.env.MAIL_SERVICE_LOGIN,
    pass: process.env.MAIL_SERVICE_PASSWORD,
  },
});

export async function sendWelcomeEmail(toEmail: string): Promise<void> {
  await transporter.sendMail({
    from: 'Message delivery bird!!!! <noreply@flutternest.wise-ee.xyz>',
    to: toEmail,
    subject: 'Welcome to FlutterNest 😍😎🥰💜',
    html: '<p>Welcome to the Nest.</p>',
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  verificationCode: string
): Promise<void> {
  await transporter.sendMail({
    from: 'FlutterNest password reset police!! 👮‍♀️🚓🚨🚨 <noreply@flutternest.wise-ee.xyz>',
    to: toEmail,
    subject: 'Your requested password reset code 🤐🤐',
    html: `<p>A password reset request has been sent</p><p>Here it is: <strong>${verificationCode}</strong></p>`,
  });
}
