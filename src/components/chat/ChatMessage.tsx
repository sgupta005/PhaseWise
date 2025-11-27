'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { formatRelativeTime } from '@/lib/task/formatters';
import { cn } from '@/lib/utils';
import { ChatMessageResponse } from '@/types/chat.types';

interface ChatMessageProps {
  message: ChatMessageResponse;
  isOwnMessage: boolean;
}

export default function ChatMessageItem({
  message,
  isOwnMessage,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-2',
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={message.sender?.image || undefined} />
        <AvatarFallback className="text-xs">
          {getInitials(message.sender?.name || 'Unknown')}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'flex flex-col max-w-[70%]',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 mb-1',
            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <span className="text-sm font-medium">
            {isOwnMessage ? 'You' : message.sender?.name || 'Unknown'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(message.createdAt))}
          </span>
        </div>
        <div
          className={cn(
            'rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words',
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
