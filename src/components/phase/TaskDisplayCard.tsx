import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { IPopulatedTask } from '@/types/project.types';
import { formatPriority, formatStatus } from '@/lib/task/formatters';

export function TaskDisplayCard({
  task,
  projectId,
}: {
  task: IPopulatedTask;
  projectId: string;
}) {
  const priorityInfo = formatPriority(task.priority);
  const statusInfor = formatStatus(task.status);

  return (
    <Link
      key={task._id.toString()}
      href={`/projects/${projectId}/tasks/${task._id.toString()}`}
      className="flex items-start gap-3 p-3 rounded-md border bg-card hover:bg-accent transition-colors group cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm font-medium',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}
          >
            {task.task}
          </p>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          {task.assignedTo && task.assignedTo.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Assigned to: {task.assignedTo.map((user) => user.name).join(', ')}
            </p>
          )}
          <Badge variant="outline" className={priorityInfo.color}>
            {priorityInfo.text}
          </Badge>
          <Badge variant="outline" className={statusInfor.color}>
            <statusInfor.icon />
            {statusInfor.text}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
