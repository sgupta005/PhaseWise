'use client';

import { ITask } from '@/types/task.types';
import KanbanCard from './KanbanCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  tasks: ITask[];
  count: number;
}

export default function KanbanColumn({
  title,
  tasks,
  count,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[280px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {tasks.length === 0 ? (
          <Card className="p-8  border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Inbox className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No tasks</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task._id.toString()} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
