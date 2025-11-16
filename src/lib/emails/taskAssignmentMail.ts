import { Resend } from 'resend';
import { generateTaskAssignmentEmail } from './templates/taskAssignment.template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTaskAssignmentEmailParams {
  to: string;
  assigneeName: string;
  assignedByName: string;
  taskTitle: string;
  projectName: string;
  taskId: string;
  projectId: string;
  priority?: string;
  dueDate?: Date | null;
}

export async function sendTaskAssignmentEmail({
  to,
  assigneeName,
  assignedByName,
  taskTitle,
  projectName,
  taskId,
  projectId,
  priority,
  dueDate,
}: SendTaskAssignmentEmailParams) {
  try {
    // Construct the task URL (update base URL as needed for production)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const taskUrl = `${baseUrl}/projects/${projectId}/tasks/${taskId}`;

    const htmlContent = generateTaskAssignmentEmail({
      assigneeName,
      assignedByName,
      taskTitle,
      projectName,
      taskUrl,
      priority,
      dueDate,
    });

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // Update this to your verified domain
      to: 'shivamgupta05.dev@gmail.com',
      subject: `New Task Assigned: ${taskTitle}`,
      html: htmlContent,
    });

    console.log('Task assignment email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    // Don't throw - we don't want email failures to break task assignment
    return null;
  }
}
