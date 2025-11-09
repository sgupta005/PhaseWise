'use client';

import { useState } from 'react';
import { ITaskDetailed } from '@/types/task.types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPriority } from '@/lib/task/formatters';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailSidebar from './TaskDetailSidebar';
import SubtasksList from './SubtasksList';
import CommentsList from './CommentsList';
import { cn } from '@/lib/utils';

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

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDelete = () => {
    // Placeholder for delete functionality (will be implemented in Phase 6)
    console.log('Delete task:', task._id.toString());
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-4">
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
              <Badge
                variant="outline"
                className={cn(priorityInfo.color, 'text-sm')}
              >
                {priorityInfo.text}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              {phaseTitle && (
                <Badge variant="outline" className="text-sm">
                  {phaseTitle}
                </Badge>
              )}
              {task.completed && (
                <Badge variant="default" className="text-sm">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />
      </div>

      {/* Three Column Layout: Comments Sidebar | Subtasks (Center) | Details Sidebar */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Sidebar - Comments */}
        <div className="w-full xl:w-80 order-2 xl:order-1">
          <CommentsList
            comments={task.comments || []}
            taskId={task._id.toString()}
            isEditMode={isEditMode}
          />
        </div>

        {/* Center - Main Content (Subtasks) */}
        <div className="flex-1 min-w-0 order-1 xl:order-2">
          <SubtasksList
            subtasks={task.subtasks || []}
            taskId={task._id.toString()}
            isEditMode={isEditMode}
          />
        </div>

        {/* Right Sidebar - Details */}
        <div className="order-3">
          <TaskDetailSidebar task={task} />
        </div>
      </div>
    </div>
  );
}
