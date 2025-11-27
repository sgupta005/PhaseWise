'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquareMore } from 'lucide-react';
import ChatMessageItem from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatMessageResponse } from '@/types/chat.types';
import { Spinner } from '../ui/spinner';

interface ChatContainerProps {
  projectId: string;
}

const POLLING_INTERVAL = 3000;

export default function ChatContainer({ projectId }: ChatContainerProps) {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageTimestampRef = useRef<string | null>(null);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-slot="scroll-area-viewport"]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(
    async (isPolling = false) => {
      try {
        const url = new URL(
          `/api/projects/${projectId}/chat`,
          window.location.origin
        );

        // If polling, only fetch new messages
        if (isPolling && lastMessageTimestampRef.current) {
          url.searchParams.set('after', lastMessageTimestampRef.current);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.success && data.data) {
          if (isPolling && data.data.length > 0) {
            setMessages((prev) => {
              // Avoid duplicates by checking IDs
              const existingIds = new Set(prev.map((m) => m._id));
              const newMessages = data.data.filter(
                (m: ChatMessageResponse) => !existingIds.has(m._id)
              );
              return [...prev, ...newMessages];
            });
            lastMessageTimestampRef.current =
              data.data[data.data.length - 1].createdAt;
            setTimeout(scrollToBottom, 100);
          } else if (!isPolling) {
            setMessages(data.data);
            if (data.data.length > 0) {
              lastMessageTimestampRef.current =
                data.data[data.data.length - 1].createdAt;
            }
            setTimeout(scrollToBottom, 100);
          }
          setError(null);
        } else if (!data.success) {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        if (!isPolling) {
          setError('Failed to load messages');
        }
      } finally {
        if (!isPolling) {
          setIsLoading(false);
        }
      }
    },
    [projectId, scrollToBottom]
  );

  // Initial fetch
  useEffect(() => {
    fetchMessages(false);
  }, [fetchMessages]);

  // Set up polling
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isLoading) {
        fetchMessages(true);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchMessages, isLoading]);

  // Callback when a message is sent - fetch new messages
  const handleMessageSent = useCallback(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2">
        <Spinner className="size-12" />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 min-h-0" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <MessageSquareMore className="size-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="pb-4 space-y-1">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message._id}
                  message={message}
                  isOwnMessage={message.sender?._id === session?.user?.id}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <ChatInput projectId={projectId} onMessageSent={handleMessageSent} />
    </div>
  );
}
