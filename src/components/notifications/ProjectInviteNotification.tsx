'use client';

import { SetStateAction, Dispatch, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatDistanceToNow } from 'date-fns';
import {
  acceptInvitationAction,
  declineInvitationAction,
} from '@/actions/invitation.actions';
import { toast } from 'sonner';
import { NotificationWithMetadata } from '../NotificationBell';

interface ProjectInviteNotificationProps {
  notification: NotificationWithMetadata;
  notifications: NotificationWithMetadata[];
  setNotifications: Dispatch<SetStateAction<NotificationWithMetadata[]>>;
  setUnreadCount: Dispatch<SetStateAction<number>>;
}

export function ProjectInviteNotification({
  notification,
  notifications,
  setNotifications,
  setUnreadCount,
}: ProjectInviteNotificationProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(
    null
  );

  const invitationId = notification.metadata?.invitationId;

  async function handleAccept() {
    if (!invitationId) {
      toast.error('Invalid invitation');
      return;
    }

    setIsProcessing(true);
    setActionType('accept');
    try {
      const result = await acceptInvitationAction(invitationId);
      if (result.success) {
        toast.success(result.message);

        // update notification bell state (unread count and read status of notification)
        const notificationId = notification._id.toString();
        setNotifications((prev) =>
          prev.map((n) =>
            n._id.toString() === notificationId
              ? {
                  ...n,
                  read: true,
                  metadata: { ...n.metadata, invitationHandled: true },
                }
              : n
          )
        );
        // Find the notification to check if it was unread
        const updatedNotification = notifications.find(
          (n) => n._id.toString() === notificationId
        );
        if (updatedNotification && !updatedNotification.read) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
        // Navigate to the project after accepting
        if (notification.link) {
          router.push(notification.link);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to accept invitation');
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  }

  async function handleDecline() {
    if (!invitationId) {
      toast.error('Invalid invitation');
      return;
    }

    setIsProcessing(true);
    setActionType('decline');
    try {
      const result = await declineInvitationAction(invitationId);
      if (result.success) {
        toast.success(result.message);

        // update notification bell state (unread count and read status of notification)
        const notificationId = notification._id.toString();
        setNotifications((prev) =>
          prev.map((n) =>
            n._id.toString() === notificationId
              ? {
                  ...n,
                  read: true,
                  metadata: { ...n.metadata, invitationHandled: true },
                }
              : n
          )
        );
        // Find the notification to check if it was unread
        const updatedNotification = notifications.find(
          (n) => n._id.toString() === notificationId
        );
        if (updatedNotification && !updatedNotification.read) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to decline invitation');
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  }

  return (
    <div className="py-2 px-2">
      <div className="flex flex-col items-start justify-between gap-2 relative">
        {!notification.read && (
          <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-blue-500" />
        )}
        <p className="font-medium text-sm pl-3">{notification.title}</p>
        <p className="text-sm text-muted-foreground pl-3">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground pl-3">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Show Accept/Decline buttons only if invitation hasn't been handled */}
      {!notification.read && (
        <div className="flex gap-2 px-2 pt-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing && actionType === 'accept' ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Accept
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleDecline}
            disabled={isProcessing}
          >
            {isProcessing && actionType === 'decline' ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Decline
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
