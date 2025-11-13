'use client';

import { useTransition, useOptimistic, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import CreateSubtaskDialog from './CreateSubtaskDialog';
import {
  toggleSubtaskAction,
  deleteSubtaskAction,
} from '@/actions/subtask.actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { FormattedSubtask } from './TaskDetailView';

interface SubtasksListProps {
  subtasks: FormattedSubtask[];
  taskId: string;
  projectId: string;
  teamMembers: { _id: string; name: string; email: string }[];
}

type OptimisticAction =
  | { type: 'add'; title: string; assignedTo?: string }
  | { type: 'toggle'; subtaskId: string; completed: boolean }
  | { type: 'delete'; subtaskId: string };

export default function SubtasksList({
  subtasks,
  taskId,
  projectId,
  teamMembers,
}: SubtasksListProps) {
  const { data: session } = useSession();

  const [optimisticSubtasks, updateOptimisticSubtasks] = useOptimistic<
    FormattedSubtask[],
    OptimisticAction
  >(subtasks, (state, action) => {
    if (action.type === 'add') {
      const optimisticSubtask: FormattedSubtask = {
        _id: `temp-${Date.now()}`,
        title: action.title,
        completed: false,
        createdBy: {
          name: session?.user?.name || 'You',
          image: session?.user?.image || null,
        },
      };
      return [...state, optimisticSubtask];
    } else if (action.type === 'toggle') {
      return state.map((subtask) =>
        subtask._id === action.subtaskId
          ? { ...subtask, completed: action.completed }
          : subtask
      );
    } else if (action.type === 'delete') {
      return state.filter((subtask) => subtask._id !== action.subtaskId);
    }
    return state;
  });

  const [isPending, startTransition] = useTransition();

  function handleToggleSubtask(subtaskId: string, completed: boolean) {
    startTransition(async () => {
      updateOptimisticSubtasks({ type: 'toggle', subtaskId, completed });
      const result = await toggleSubtaskAction(
        subtaskId,
        taskId,
        projectId,
        completed
      );

      if (result.success) {
        toast.success('Subtask updated');
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDeleteSubtask(subtaskId: string) {
    startTransition(async () => {
      updateOptimisticSubtasks({ type: 'delete', subtaskId });
      const result = await deleteSubtaskAction(subtaskId, taskId, projectId);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [optimisticSubtasks.length]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-shrink-0">
        <CardTitle>Subtasks ({optimisticSubtasks?.length || 0})</CardTitle>
        <CreateSubtaskDialog
          taskId={taskId}
          projectId={projectId}
          teamMembers={teamMembers}
          onOptimisticAdd={(data) =>
            updateOptimisticSubtasks({
              type: 'add',
              title: data.title,
              assignedTo: data.assignedTo,
            })
          }
        >
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="size-4" />
            Create Subtask
          </Button>
        </CreateSubtaskDialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0" ref={scrollRef}>
        {!optimisticSubtasks || optimisticSubtasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pb-8 text-center h-full">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Plus className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Break down this task into smaller, <br /> manageable steps
            </p>
            <CreateSubtaskDialog
              taskId={taskId}
              projectId={projectId}
              teamMembers={teamMembers}
              onOptimisticAdd={(data) =>
                updateOptimisticSubtasks({
                  type: 'add',
                  title: data.title,
                  assignedTo: data.assignedTo,
                })
              }
            >
              <Button size="sm">
                <Plus className="size-4" />
                Create Subtask
              </Button>
            </CreateSubtaskDialog>
          </div>
        ) : (
          <div className="space-y-3">
            {optimisticSubtasks.map((subtask, index) => (
              <div key={subtask._id}>
                <div className="flex items-start gap-3 group">
                  <Checkbox
                    checked={subtask.completed}
                    disabled={isPending}
                    onCheckedChange={(checked) =>
                      handleToggleSubtask(subtask._id, checked as boolean)
                    }
                    className="mt-1"
                    aria-label={`Mark subtask "${subtask.title}" as ${subtask.completed ? 'incomplete' : 'complete'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm mb-2 ${
                        subtask.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {subtask.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {subtask.assignedTo && (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5">
                            <AvatarImage
                              src={subtask.assignedTo.image || undefined}
                            />
                            <AvatarFallback className="text-xs">
                              {getInitials(subtask.assignedTo.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {subtask.assignedTo.name}{' '}
                            <span className="text-muted-foreground/70">
                              (Assignee)
                            </span>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage
                            src={subtask.createdBy?.image || undefined}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(subtask.createdBy?.name || 'Unknown')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {subtask.createdBy?.name || 'Unknown'}{' '}
                          <span className="text-muted-foreground/70">
                            (Creator)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteSubtask(subtask._id)}
                    disabled={isPending}
                    aria-label="Delete subtask"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {index < optimisticSubtasks.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
