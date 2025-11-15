'use client';

import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils/avatar';
import { formatDueDate } from '@/lib/task/formatters';
import { Minus } from 'lucide-react';

interface TaskDetailSidebarProps {
  task: ITaskDetailed;
}

export default function TaskDetailSidebar({ task }: TaskDetailSidebarProps) {
  const dueDateFormatted = formatDueDate(task.dueDate);

  return (
    <div className="w-full xl:w-80 space-y-4">
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Assigned To */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Assigned To
            </p>
            {task.assignedTo && task.assignedTo.length > 0 ? (
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {task.assignedTo.map((assignee) => (
                    <div
                      key={assignee._id.toString()}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="size-8">
                        <AvatarImage src={assignee.image} />
                        <AvatarFallback className="text-xs">
                          {getInitials(assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignee.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unassigned</p>
            )}
          </div>

          <Separator />

          {/* Created By */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Created By
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={task.createdBy?.image} />
                <AvatarFallback className="text-xs">
                  {getInitials(task.createdBy?.name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {task.createdBy?.name || 'Unknown'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Due Date */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Due Date
            </p>
            {task.dueDate ? (
              <p className="text-sm">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            ) : dueDateFormatted ? (
              <p className="text-sm">{dueDateFormatted}</p>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Minus className="size-4" />
                No due date
              </p>
            )}
          </div>

          <Separator />

          {/* Created At */}
          {task.createdAt && (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Created
                </p>
                <p className="text-sm">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </>
          )}

          {/* Updated At */}
          {/* {task.updatedAt && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Last Updated
              </p>
              <p className="text-sm">
                {new Date(task.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}
