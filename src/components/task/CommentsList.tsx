'use client';

import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { formatRelativeTime } from '@/lib/task/formatters';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowUp, Send } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';

interface CommentsListProps {
  comments: ITaskDetailed['comments'];
  taskId: string;
  isEditMode: boolean;
}

export default function CommentsList({
  comments,
  taskId,
  isEditMode,
}: CommentsListProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    // TODO: Implement comment submission in Phase 5
    console.log('Submit comment:', commentText);
    setCommentText('');
  };

  return (
    <Card className="sticky top-4 flex flex-col min-h-[580px]">
      <CardHeader>
        <CardTitle>Comments ({comments?.length || 0})</CardTitle>
      </CardHeader>

      {/* Comments List */}
      {!comments || comments.length === 0 ? (
        <p className="flex-1 flex items-center justify-center text-sm text-muted-foreground text-center">
          No comments yet.
        </p>
      ) : (
        <CardContent className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {comments.map((comment, index) => (
            <div key={comment._id.toString()}>
              <div className="flex gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={comment.createdBy?.image} />
                  <AvatarFallback>
                    {getInitials(comment.createdBy?.name || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.createdBy?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                    {comment.comment}
                  </p>
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      )}

      <div className="px-4">
        <div className="space-y-2 relative">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[100px] resize-none p-3"
          />
          <Button size="icon" className="absolute bottom-2 right-2">
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
