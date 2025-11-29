'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Spinner } from './ui/spinner';
import { NotificationDocument } from '@/models/notification.model';
import {
  markAllNotificationAsRead,
  markNotificationAsRead,
} from '@/actions/notification.actions';
import { ProjectInviteNotification } from './notifications/ProjectInviteNotification';

export interface NotificationWithMetadata extends NotificationDocument {
  metadata?: {
    invitationId?: string;
    invitedBy?: string;
    projectId?: string;
    role?: 'faculty' | 'student';
  };
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<
    NotificationWithMetadata[]
  >([]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  async function fetchUnreadCount() {
    try {
      const response = await fetch('/api/notifications/unread-count');
      const result = await response.json();
      setUnreadCount(result.data?.count || 0);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  }

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications');
      const result = await response.json();
      setNotifications(result.data || []);
      console.log('Notifications fetched:', result.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegularNotificationClick(
    notification: NotificationWithMetadata
  ) {
    if (!notification.read) {
      const result = await markNotificationAsRead(notification._id.toString());
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    }
  }

  function isProjectInvite(notification: NotificationWithMetadata): boolean {
    return notification.type === 'PROJECT_INVITE';
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={async () => {
                const result = await markAllNotificationAsRead();
                if (result.success) {
                  setNotifications((prev) =>
                    prev.map((notification) => ({
                      ...notification,
                      read: true,
                    }))
                  );
                  setUnreadCount(0);
                }
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center text-center text-sm text-muted-foreground">
              <Spinner />
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification._id.toString()}>
                  {isProjectInvite(notification) ? (
                    // Render ProjectInviteNotification for PROJECT_INVITE type
                    <ProjectInviteNotification
                      key={notification._id.toString()}
                      notifications={notifications}
                      setNotifications={setNotifications}
                      setUnreadCount={setUnreadCount}
                      notification={notification}
                    />
                  ) : (
                    // Render regular notification with Link
                    <Link
                      className="block"
                      onClick={() =>
                        handleRegularNotificationClick(notification)
                      }
                      href={notification.link || '/projects'}
                    >
                      <div className="flex flex-col items-start justify-between gap-2 px-2 py-2 relative hover:bg-accent transition-colors">
                        {!notification.read && (
                          <div className="absolute top-2 left-0 w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        <p className="font-medium text-sm pl-3">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground pl-3">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground pl-3">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
