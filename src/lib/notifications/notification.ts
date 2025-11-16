import { connectDb } from '@/dbConfig/dbConfig';
import Notification, {
  NotificationDocument,
} from '@/models/notification.model';
import { sendTaskAssignmentEmail } from '@/lib/emails/taskAssignmentMail';

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

export async function sendTaskAssignmentNotification(data: TaskAssignmentData) {
  try {
    await connectDb();

    // Create in-app notification (blocking - critical)
    await Notification.create<NotificationDocument>({
      triggeredBy: data.assignedById,
      userId: data.assigneeId,
      type: 'TASK_ASSIGNED',
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
      taskId: data.taskId,
      projectId: data.projectId,
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
