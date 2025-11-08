'use client';

import { useState } from 'react';
import { ITask, ITaskStatus, GroupByMode } from '@/types/task.types';
import { groupTasks } from '@/lib/task/groupTasks';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { PRIORITIES } from '@/constants';

interface TaskBoardProps {
  tasks: ITask[];
  projectId: string;
  taskStatuses: ITaskStatus[];
}

export default function TaskBoard({
  tasks,
  projectId,
  taskStatuses,
}: TaskBoardProps) {
  const [groupByMode, setGroupByMode] = useState<GroupByMode>('status');

  // Get column definitions based on grouping mode
  function getColumns(): { key: string; title: string }[] {
    if (groupByMode === 'status') {
      return taskStatuses.map((status) => ({
        key: status.id,
        title: status.name,
      }));
    } else {
      return PRIORITIES.map((priority) => ({
        key: priority,
        title: priority,
      }));
    }
  }

  // Group tasks by current mode
  const groupedTasks = groupTasks(tasks, groupByMode);
  const groupedTasksMap = new Map(groupedTasks);

  // Get all columns
  const columns = getColumns();

  return (
    <div className="flex flex-col h-[78vh]">
      <div className="flex items-center gap-2 mb-4 ml-auto mr-0">
        <Button
          variant={groupByMode === 'status' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setGroupByMode('status')}
          className="gap-2"
        >
          <List className="size-4" />
          Group by Status
        </Button>
        <Button
          variant={groupByMode === 'priority' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setGroupByMode('priority')}
          className="gap-2"
        >
          <LayoutGrid className="size-4" />
          Group by Priority
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-h-0">
          {columns.map((column) => {
            const columnTasks = groupedTasksMap.get(column.key) || [];
            return (
              <KanbanColumn
                key={column.key}
                title={column.title}
                tasks={columnTasks}
                count={columnTasks.length}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
