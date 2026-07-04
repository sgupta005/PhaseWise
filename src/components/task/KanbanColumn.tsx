'use client';

import { useDroppable } from '@dnd-kit/core';
import { ITaskWithTeam, ITaskStatus, GroupByMode } from '@/types/task.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateTaskForm from './CreateTaskForm';
import { PRIORITIES } from '@/constants';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: ITaskWithTeam[];
  count: number;
  children: React.ReactNode;
  projectId: string;
  phases: { _id: string; title: string }[];
  teamMembers: { _id: string; name: string; email: string }[];
  taskStatuses: ITaskStatus[];
  columnKey: string;
  groupByMode: GroupByMode;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  count,
  children,
  projectId,
  phases,
  teamMembers,
  taskStatuses,
  columnKey,
  groupByMode,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full min-w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] sm:min-w-70 sm:max-w-70 snap-start sm:snap-align-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
        <CreateTaskForm
          projectId={projectId}
          phases={phases}
          teamMembers={teamMembers}
          taskStatuses={taskStatuses}
          initialValues={
            groupByMode === 'status'
              ? { status: columnKey }
              : { priority: columnKey as (typeof PRIORITIES)[number] }
          }
          triggerButton={
            <Button variant="ghost" size="icon" className="text-primary">
              <Plus className="size-4" />
            </Button>
          }
        />
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 overflow-y-auto space-y-2 pr-2 rounded-lg transition-colors min-h-[200px]',
          isOver && 'bg-accent'
        )}
      >
        {tasks.length === 0 ? (
          <Card className="p-8 border-dashed border-[1.6px] h-[228px] flex items-center justify-center">
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
