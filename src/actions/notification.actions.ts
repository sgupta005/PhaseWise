'use server';

import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Notification from '@/models/notification.model';

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    await connectDb();

    if (!notificationId) {
      return {
        success: false,
        message: 'Notification ID is required',
      };
    }

    const notification = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
        userId: session.user.id,
      },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return {
        success: false,
        message: 'Notification not found',
      };
    }

    return {
      success: true,
      message: 'Notification marked as read',
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      message: 'Failed to mark notification as read',
    };
  }
}

export async function markAllNotificationAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    await connectDb();

    const result = await Notification.updateMany(
      { userId: session.user.id, read: false },
      { read: true }
    );
    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: 'No unread notifications found',
      };
    }

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      message: 'Failed to mark all notifications as read',
    };
  }
}
