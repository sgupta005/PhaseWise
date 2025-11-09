'use client';

import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { formatRelativeTime } from '@/lib/task/formatters';
import { Separator } from '@/components/ui/separator';

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
  if (!comments || comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No comments yet. {isEditMode && 'Add a comment below.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.map((comment, index) => (
          <div key={comment._id.toString()}>
            <div className="flex gap-3">
              <Avatar className="size-8">
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
    </Card>
  );
}

