'use client';

import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { Separator } from '@/components/ui/separator';

interface SubtasksListProps {
  subtasks: ITaskDetailed['subtasks'];
  taskId: string;
  isEditMode: boolean;
}

export default function SubtasksList({
  subtasks,
  taskId,
  isEditMode,
}: SubtasksListProps) {
  if (!subtasks || subtasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subtasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No subtasks yet. {isEditMode && 'Add subtasks in edit mode.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtasks ({subtasks.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {subtasks.map((subtask, index) => (
          <div key={subtask._id.toString()}>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={subtask.completed}
                disabled={!isEditMode}
                className="mt-1"
                aria-label={`Mark subtask "${subtask.title}" as ${subtask.completed ? 'incomplete' : 'complete'}`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    subtask.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {subtask.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="size-5">
                    <AvatarImage src={subtask.createdBy?.image} />
                    <AvatarFallback className="text-xs">
                      {getInitials(subtask.createdBy?.name || 'Unknown')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {subtask.createdBy?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            {index < subtasks.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

