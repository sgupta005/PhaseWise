import { connectDb } from '@/dbConfig/dbConfig';
import Notification, {
  NotificationDocument,
} from '@/models/notification.model';
import { sendTaskAssignmentEmail } from '@/lib/emails/taskAssignmentMail';
import { sendProjectInvitationEmail } from '@/lib/emails/projectInvitationMail';
import { sendProjectAddedEmail } from '@/lib/emails/projectAddedMail';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface TaskAssignmentData {
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeEmail: string;
  assignedById: string;
  assignedByName: string;
  priority?: string;
  dueDate?: Date | null;
}

interface ProjectInviteData {
  projectId: string;
  projectName: string;
  inviteeId: string;
  inviteeName: string;
  inviteeEmail: string;
  inviterId: string;
  inviterName: string;
  role: 'faculty' | 'student';
  invitationId: string;
}

interface ProjectAddedData {
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userEmail: string;
  addedById: string;
  addedByName: string;
  role: 'faculty' | 'student';
}

export async function sendTaskAssignmentNotification(data: TaskAssignmentData) {
  try {
    await connectDb();
    const taskUrl = `${baseUrl}/projects/${data.projectId}/tasks/${data.taskId}`;

    // Create in-app notification (blocking - critical)
    await Notification.create<NotificationDocument>({
      triggeredBy: data.assignedById,
      userId: data.assigneeId,
      type: 'TASK_ASSIGNED',
      link: taskUrl,
      title: 'New Task Assignment',
      message: `${data.assignedByName} assigned you "${data.taskTitle}" in ${data.projectName}`,
      metadata: {
        taskId: data.taskId,
        projectId: data.projectId,
        assignedBy: data.assignedById,
      },
    });

    // Send email notification (non-blocking)
    // Don't await to avoid blocking the task assignment flow
    sendTaskAssignmentEmail({
      to: data.assigneeEmail,
      assigneeName: data.assigneeName,
      assignedByName: data.assignedByName,
      taskTitle: data.taskTitle,
      projectName: data.projectName,
      taskUrl: taskUrl,
      priority: data.priority,
      dueDate: data.dueDate,
    }).catch((error) => {
      // Log email errors but don't let them break the notification flow
      console.error('Failed to send task assignment email:', error);
    });
  } catch (error) {
    console.error('Error sending task assignment notification:', error);
    throw error;
  }
}

export async function sendProjectInviteNotification(data: ProjectInviteData) {
  try {
    await connectDb();
    const projectUrl = `${baseUrl}/projects/${data.projectId}`;

    // Create in-app notification (blocking - critical)
    await Notification.create<NotificationDocument>({
      triggeredBy: data.inviterId,
      userId: data.inviteeId,
      type: 'PROJECT_INVITE',
      link: projectUrl,
      title: 'Project Invitation',
      message: `${data.inviterName} invited you to join "${data.projectName}" as a ${data.role === 'faculty' ? 'Faculty Mentor' : 'Team Member'}`,
      metadata: {
        projectId: data.projectId,
        invitationId: data.invitationId,
        invitedBy: data.inviterId,
        role: data.role,
      },
    });

    // Send email notification (non-blocking)
    sendProjectInvitationEmail({
      to: data.inviteeEmail,
      inviteeName: data.inviteeName,
      inviterName: data.inviterName,
      projectName: data.projectName,
      role: data.role,
      projectUrl: projectUrl,
    }).catch((error) => {
      console.error('Failed to send project invitation email:', error);
    });
  } catch (error) {
    console.error('Error sending project invitation notification:', error);
    throw error;
  }
}

export async function sendProjectAddedNotification(data: ProjectAddedData) {
  try {
    await connectDb();
    const projectUrl = `${baseUrl}/projects/${data.projectId}`;

    // Create in-app notification (blocking - critical)
    await Notification.create<NotificationDocument>({
      triggeredBy: data.addedById,
      userId: data.userId,
      type: 'PROJECT_ADDED',
      link: projectUrl,
      title: 'Added to Project',
      message: `${data.addedByName} added you to "${data.projectName}" as a ${data.role === 'faculty' ? 'Faculty Mentor' : 'Team Member'}`,
      metadata: {
        projectId: data.projectId,
        addedBy: data.addedById,
        role: data.role,
      },
    });

    // Send email notification (non-blocking)
    sendProjectAddedEmail({
      to: data.userEmail,
      userName: data.userName,
      addedByName: data.addedByName,
      projectName: data.projectName,
      role: data.role,
      projectUrl: projectUrl,
    }).catch((error) => {
      console.error('Failed to send project added email:', error);
    });
  } catch (error) {
    console.error('Error sending project added notification:', error);
    throw error;
  }
}
