import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    console.log('Sending verification email to:', email);
    const verificationUrl = `http://localhost:3000/new-verification?token=${token}`;

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `<p>Please click the link below to verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    return response;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
