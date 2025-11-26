import { Resend } from 'resend';
import { generateProjectAddedEmail } from './templates/projectAdded.template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendProjectAddedEmailParams {
  to: string;
  userName: string;
  addedByName: string;
  projectName: string;
  role: 'faculty' | 'student';
  projectUrl: string;
}

export async function sendProjectAddedEmail({
  to,
  userName,
  addedByName,
  projectName,
  role,
  projectUrl,
}: SendProjectAddedEmailParams) {
  try {
    const htmlContent = generateProjectAddedEmail({
      userName,
      addedByName,
      projectName,
      role,
      projectUrl,
    });

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'shivamgupta05.dev@gmail.com',
      subject: `You've been added to: ${projectName}`,
      html: htmlContent,
    });

    console.log('Project added email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending project added email:', error);
    return null;
  }
}
