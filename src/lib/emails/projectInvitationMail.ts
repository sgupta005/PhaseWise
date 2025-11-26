import { Resend } from 'resend';
import { generateProjectInvitationEmail } from './templates/projectInvitation.template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendProjectInvitationEmailParams {
  to: string;
  inviteeName: string;
  inviterName: string;
  projectName: string;
  role: 'faculty' | 'student';
  projectUrl: string;
}

export async function sendProjectInvitationEmail({
  to,
  inviteeName,
  inviterName,
  projectName,
  role,
  projectUrl,
}: SendProjectInvitationEmailParams) {
  try {
    const htmlContent = generateProjectInvitationEmail({
      inviteeName,
      inviterName,
      projectName,
      role,
      projectUrl,
    });

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'shivamgupta05.dev@gmail.com',
      subject: `Project Invitation: ${projectName}`,
      html: htmlContent,
    });

    console.log('Project invitation email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending project invitation email:', error);
    return null;
  }
}
