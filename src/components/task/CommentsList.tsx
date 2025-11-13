'use client';

import {
  useState,
  useTransition,
  useOptimistic,
  useRef,
  useEffect,
} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/task/formatters';
import { useSession } from 'next-auth/react';

import { addCommentAction } from '@/actions/comment.actions';
import { FormattedComment } from './TaskDetailView';

interface CommentsListProps {
  comments: FormattedComment[];
  taskId: string;
  projectId: string;
  isEditMode: boolean;
}

export default function CommentsList({
  comments,
  taskId,
  projectId,
  isEditMode,
}: CommentsListProps) {
  const { data: session } = useSession();

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    FormattedComment[],
    string
  >(comments, (state, newCommentText: string) => {
    const optimisticComment: FormattedComment = {
      _id: Date.now().toString(),
      comment: newCommentText,
      createdAt: new Date(),
      createdBy: {
        name: session?.user?.name || 'You',
        image: session?.user?.image || '',
      },
    };
    return [...state, optimisticComment];
  });

  const [commentText, setCommentText] = useState('');
  const [isPending, startTransition] = useTransition();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [optimisticComments.length]);

  function handleSubmit() {
    // Validate comment text
    if (!commentText || commentText.trim().length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }

    const textToSubmit = commentText;
    setCommentText('');

    startTransition(async function () {
      addOptimisticComment(textToSubmit);
      const result = await addCommentAction(taskId, projectId, textToSubmit);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setCommentText(textToSubmit);
      }
    });
  }

  return (
    <Card className="h-full flex flex-col shadow-none bg-background">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Comments ({optimisticComments?.length || 0})</CardTitle>
      </CardHeader>

      {/* Comments List */}
      {!optimisticComments || optimisticComments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-0">
          <p className="text-sm text-muted-foreground text-center">
            No comments yet.
          </p>
        </div>
      ) : (
        <CardContent
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 min-h-0"
        >
          {optimisticComments.map((comment, index) => (
            <div key={comment._id}>
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
                  <p
                    className={`text-sm text-foreground whitespace-pre-wrap break-words ${
                      isPending ? 'opacity-70' : ''
                    }`}
                  >
                    {comment.comment}
                  </p>
                </div>
              </div>
              {index < optimisticComments.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </CardContent>
      )}

      <div className="px-4 flex-shrink-0">
        <div className="space-y-2 relative">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[100px] resize-none p-3 bg-muted-foreground/10"
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handleSubmit}
            disabled={isPending || !commentText.trim()}
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
