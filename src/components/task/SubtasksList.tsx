'use client';

import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  const handleCreateSubtask = () => {
    // TODO: Implement subtask creation in Phase 4
    console.log('Create subtask');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Subtasks ({subtasks?.length || 0})</CardTitle>
        <Button
          onClick={handleCreateSubtask}
          size="sm"
          variant="outline"
          className="h-8"
        >
          <Plus className="size-4" />
          Create Subtask
        </Button>
      </CardHeader>
      <CardContent>
        {!subtasks || subtasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pb-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Plus className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Break down this task into smaller, <br /> manageable steps
            </p>
            <Button onClick={handleCreateSubtask} size="sm">
              <Plus className="size-4" />
              Create Subtask
            </Button>
          </div>
        ) : (
          subtasks.map((subtask, index) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
}
