'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationDocument[]>(
    []
  );

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
      setNotifications(result.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
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
                <Link
                  className="block"
                  onClick={async () => {
                    if (!notification.read) {
                      const result = await markNotificationAsRead(
                        notification._id.toString()
                      );
                      if (result.success) {
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n._id === notification._id
                              ? { ...n, read: true }
                              : n
                          )
                        );
                        setUnreadCount(Math.max(unreadCount - 1, 0));
                      }
                    }
                  }}
                  href={notification.link || '/'}
                  key={notification._id.toString()}
                >
                  <div className="flex items-start justify-between gap-2">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                    <div className={cn('flex-1', notification.read && 'pl-2')}>
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 mb-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full text-center">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
