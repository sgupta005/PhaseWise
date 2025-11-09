'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITask } from '@/types/task.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/lib/utils/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatPriority } from '@/lib/task/formatters';

interface KanbanCardProps {
  task: ITask;
  id: string;
}

export default function KanbanCard({ task, id }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityInfo = formatPriority(task.priority);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`tasks/${task._id.toString()}`}>
        <Card
          className={cn(
            'cursor-grab active:cursor-grabbing',
            isDragging && 'opacity-50'
          )}
        >
          <CardContent className="flex flex-col space-y-2">
            <Badge variant="outline" className="w-full">
              <span className="text-xs truncate">{task.phaseTitle}</span>
            </Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityInfo.color}>
                {priorityInfo.text}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm font-medium line-clamp-3">
              {task.task || 'Untitled Task'}
            </div>

            {task.assignedTo.length === 0 ? (
              <Badge variant="outline" className="text-xs">
                Unassigned
              </Badge>
            ) : (
              <div className="flex -space-x-2">
                {task.assignedTo.slice(0, 3).map((assignee) => (
                  <Avatar
                    key={assignee._id.toString()}
                    className="size-6 border-2 border-background"
                  >
                    <AvatarImage src={assignee.image} />
                    <AvatarFallback className="text-xs">
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignedTo.length > 3 && (
                  <div className="size-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      +{task.assignedTo.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
