'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { sendMessageAction } from '@/actions/chat.actions';

interface ChatInputProps {
  projectId: string;
  onMessageSent: () => void;
}

export default function ChatInput({
  projectId,
  onMessageSent,
}: ChatInputProps) {
  const [messageText, setMessageText] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!messageText || messageText.trim().length === 0) {
      return;
    }

    const textToSubmit = messageText;
    setMessageText('');

    startTransition(async () => {
      const result = await sendMessageAction(projectId, textToSubmit);

      if (result.success) {
        onMessageSent();
      } else {
        toast.error(result.message);
        setMessageText(textToSubmit);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="p-4 bg-background">
      <div className="flex gap-2 items-end relative">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[44px]"
          disabled={isPending}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={isPending || !messageText.trim()}
          className="shrink-0 absolute bottom-1 right-1"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
