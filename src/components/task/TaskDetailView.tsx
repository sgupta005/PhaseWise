import { ITaskDetailed, ITaskStatus } from '@/types/task.types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPriority, formatStatus } from '@/lib/task/formatters';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailSidebar from './TaskDetailSidebar';
import SubtasksList from './SubtasksList';
import CommentsList from './CommentsList';
import { cn } from '@/lib/utils';

export type FormattedComment = {
  _id: string;
  comment: string;
  createdAt: Date;
  createdBy: {
    name: string;
    image: string;
  };
};

export type FormattedSubtask = {
  _id: string;
  title: string;
  completed: boolean;
  createdBy: {
    name: string;
    image: string | null;
  };
};

interface TaskDetailViewProps {
  task: ITaskDetailed;
  projectId: string;
  phaseTitle?: string | null;
  currentPhaseId: string;
  teamMembers: { _id: string; name: string; email: string }[];
  phases: { _id: string; title: string }[];
  taskStatuses: ITaskStatus[];
}

export default function TaskDetailView({
  task,
  projectId,
  phaseTitle,
  currentPhaseId,
  teamMembers,
  phases,
  taskStatuses,
}: TaskDetailViewProps) {
  // Prepare task data for editing
  const taskData = {
    task: task.task || '',
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo.map((user) => user._id.toString()),
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : null,
  };

  const priorityInfo = formatPriority(task.priority);
  const statusInfo = formatStatus(task.status);

  const formattedComments: FormattedComment[] =
    task?.comments?.map((comment) => {
      return {
        _id: comment._id.toString(),
        comment: comment.comment,
        createdAt: comment.createdAt,
        createdBy: {
          name: comment.createdBy.name,
          email: comment.createdBy.email,
          image: comment.createdBy.image,
        },
      };
    }) || [];

  const formattedSubtasks: FormattedSubtask[] =
    task?.subtasks?.map((subtask) => {
      return {
        _id: subtask._id.toString(),
        title: subtask.title,
        completed: subtask.completed,
        createdBy: {
          name: subtask.createdBy.name,
          image: subtask.createdBy.image,
        },
      };
    }) || [];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col px-6 py-4">
      <div className="flex-shrink-0 mb-4">
        <TaskDetailHeader
          projectId={projectId}
          taskId={task._id.toString()}
          currentPhaseId={currentPhaseId}
          taskData={taskData}
          phases={phases}
          teamMembers={teamMembers}
          taskStatuses={taskStatuses}
        />
      </div>

      <div className="flex-shrink-0 space-y-4 mb-6">
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
              <Badge
                variant="outline"
                className={cn(statusInfo.color, 'text-sm')}
              >
                <statusInfo.icon />
                {statusInfo.text}
              </Badge>
              {phaseTitle && (
                <Badge variant="outline" className="text-sm">
                  {phaseTitle}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full md:flex-[1_0_300px] order-2 md:order-1 h-full">
          <CommentsList
            comments={formattedComments || []}
            taskId={task._id.toString()}
            projectId={projectId}
          />
        </div>

        <div className="flex-[2_0_450px] order-1 md:order-2 h-full">
          <SubtasksList
            subtasks={formattedSubtasks || []}
            taskId={task._id.toString()}
            projectId={projectId}
            teamMembers={teamMembers}
          />
        </div>

        <div className="order-3 md:w-80 md:flex-shrink-0 pb-4">
          <TaskDetailSidebar task={task} />
        </div>
      </div>
    </div>
  );
}
