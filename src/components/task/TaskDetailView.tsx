'use client';

import { useState } from 'react';
import { ITaskDetailed } from '@/types/task.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils/avatar';
import { formatPriority, formatDueDate } from '@/lib/task/formatters';
import TaskDetailHeader from './TaskDetailHeader';
import SubtasksList from './SubtasksList';
import CommentsList from './CommentsList';
import { Minus } from 'lucide-react';

interface TaskDetailViewProps {
  task: ITaskDetailed;
  projectId: string;
  phaseTitle?: string | null;
}

export default function TaskDetailView({
  task,
  projectId,
  phaseTitle,
}: TaskDetailViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const priorityInfo = formatPriority(task.priority);
  const dueDateFormatted = formatDueDate(task.dueDate);

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDelete = () => {
    // Placeholder for delete functionality (will be implemented in Phase 6)
    console.log('Delete task:', task._id.toString());
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-6">
      <TaskDetailHeader
        projectId={projectId}
        taskId={task._id.toString()}
        isEditMode={isEditMode}
        onToggleEdit={handleToggleEdit}
        onDelete={handleDelete}
      />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">
              {task.task || 'Untitled Task'}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={priorityInfo.color}>
                {priorityInfo.text}
              </Badge>
              <Badge variant="outline">
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              {phaseTitle && <Badge variant="outline">{phaseTitle}</Badge>}
              {task.completed && <Badge variant="default">Completed</Badge>}
            </div>
          </div>
        </div>

        <Separator />

        {/* Details Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned To */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Assigned To
                </p>
                {task.assignedTo && task.assignedTo.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex -space-x-2">
                      {task.assignedTo.slice(0, 5).map((assignee) => (
                        <Avatar
                          key={assignee._id.toString()}
                          className="size-8 border-2 border-background"
                        >
                          <AvatarImage src={assignee.image} />
                          <AvatarFallback>
                            {getInitials(assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {task.assignedTo.length > 5 && (
                        <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{task.assignedTo.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      {task.assignedTo.slice(0, 3).map((assignee) => (
                        <span key={assignee._id.toString()} className="text-sm">
                          {assignee.name}
                        </span>
                      ))}
                      {task.assignedTo.length > 3 && (
                        <span className="text-sm text-muted-foreground">
                          and {task.assignedTo.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Unassigned</p>
                )}
              </div>

              {/* Created By */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Created By
                </p>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={task.createdBy?.image} />
                    <AvatarFallback>
                      {getInitials(task.createdBy?.name || 'Unknown')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {task.createdBy?.name || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Due
                </p>
                <p className="text-sm">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) ||
                    dueDateFormatted || (
                      <Minus className="size-4 text-muted-foreground" />
                    )}
                </p>
              </div>

              {/* Completed Status */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Status
                </p>
                <p className="text-sm">
                  {task.completed
                    ? 'Completed'
                    : task.status.charAt(0).toUpperCase() +
                      task.status.slice(1)}
                </p>
              </div>

              {/* Created At */}
              {task.createdAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
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
              )}

              {/* Updated At */}
              {task.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subtasks Section */}
      <SubtasksList
        subtasks={task.subtasks || []}
        taskId={task._id.toString()}
        isEditMode={isEditMode}
      />

      {/* Comments Section */}
      <CommentsList
        comments={task.comments || []}
        taskId={task._id.toString()}
        isEditMode={isEditMode}
      />
    </div>
  );
}
