import { connectDb } from '@/dbConfig/dbConfig';
import Notification, {
  NotificationDocument,
} from '@/models/notification.model';

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
}

export async function sendTaskAssignmentNotification(data: TaskAssignmentData) {
  try {
    await connectDb();
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
  } catch (error) {
    console.error('Error sending task assignment notification:', error);
  }
}
