'use client';

import { ITask } from '@/types/task.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/lib/utils/avatar';
import { Minus } from 'lucide-react';

interface KanbanCardProps {
  task: ITask;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <Card className="cursor-grab active:cursor-grabbing">
      <CardContent className="flex flex-col space-y-2">
        <Badge variant="outline" className="w-full">
          <span className="text-xs truncate">{task.phaseTitle}</span>
        </Badge>
        <Badge variant="outline" className="text-xs">
          {task.priority}
        </Badge>
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
  );
}
