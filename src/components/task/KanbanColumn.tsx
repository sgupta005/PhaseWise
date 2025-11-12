'use client';

import { useDroppable } from '@dnd-kit/core';
import { ITaskWithTeam } from '@/types/task.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: ITaskWithTeam[];
  count: number;
  children: React.ReactNode;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  count,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

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

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 overflow-y-auto space-y-2 pr-2 rounded-lg transition-colors min-h-[200px]',
          isOver && 'bg-accent'
        )}
      >
        {tasks.length === 0 ? (
          <Card className="p-8 border-dashed border-[1.6px] min-h-[228px] flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Inbox className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No tasks</p>
            </CardContent>
          </Card>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
