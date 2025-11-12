'use client';

import { useState, useOptimistic } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  ITaskWithTeam,
  ITaskStatus,
  GroupByMode,
  TaskUpdateResponse,
} from '@/types/task.types';
import { groupTasks } from '@/lib/task/groupTasks';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { LayoutGrid, List } from 'lucide-react';
import { PRIORITIES } from '@/constants';
import { updateTaskAction } from '@/actions/task.actions';
import { toast } from 'sonner';
import { getColumns } from '@/lib/task/getColumns';
import { createCollisonStrategy } from '@/lib/task/collisonStrategy';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskBoardProps {
  tasks: ITaskWithTeam[];
  projectId: string;
  taskStatuses: ITaskStatus[];
}

export default function TaskBoard({
  tasks,
  projectId,
  taskStatuses,
}: TaskBoardProps) {
  const [groupByMode, setGroupByMode] = useState<GroupByMode>('status');
  const [optimisticTasks, addOptimisticTasks] = useOptimistic(
    tasks,
    (state: ITaskWithTeam[], updatedTask: ITaskWithTeam) => {
      // Replace the task with the updated version
      return state.map((task) =>
        task._id.toString() === updatedTask._id.toString() ? updatedTask : task
      );
    }
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor)
  );

  const groupedTasks = groupTasks(optimisticTasks, groupByMode);
  const groupedTasksMap = new Map(groupedTasks);
  const columns = getColumns(groupByMode, taskStatuses);
  const activeTask = optimisticTasks.find(
    (task) => task._id.toString() === activeTaskId
  );

  const collisionDetectionStrategy = createCollisonStrategy(columns);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetColumnKey = over.id as string;

    // Check if the drop target is a valid column
    const isValidColumn = columns.some(
      (column) => column.key === targetColumnKey
    );
    if (!isValidColumn) return;

    // If the target column is the same as the active column, don't update
    if (targetColumnKey === active.id) return;

    // Find the task being dragged
    const draggedTask = optimisticTasks.find(
      (task) => task._id.toString() === taskId
    );
    if (!draggedTask) return;

    // Determine what field to update based on grouping mode
    let updatePayload: { status?: string; priority?: string } = {};
    if (groupByMode === 'status') {
      if (draggedTask.status === targetColumnKey) return; // No change
      updatePayload.status = targetColumnKey;
    } else {
      if (draggedTask.priority === targetColumnKey) return; // No change
      updatePayload.priority = targetColumnKey as (typeof PRIORITIES)[number];
    }

    addOptimisticTasks({ ...draggedTask, ...updatePayload } as ITaskWithTeam);

    const result: TaskUpdateResponse = await updateTaskAction({
      taskId,
      projectId,
      status: updatePayload.status,
      priority: updatePayload.priority as
        | (typeof PRIORITIES)[number]
        | undefined,
    });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(event.active.id as string);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-[78vh]">
        <div className="flex items-center mb-4 ml-auto mr-2 -mt-10">
          <Tabs
            value={groupByMode}
            onValueChange={(value) => setGroupByMode(value as GroupByMode)}
          >
            <TabsList>
              <TabsTrigger value="status">
                <List className="size-4" />
                Group by Status
              </TabsTrigger>
              <TabsTrigger value="priority">
                <LayoutGrid className="size-4" />
                Group by Priority
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-h-0">
            {columns.map((column) => {
              const columnTasks = groupedTasksMap.get(column.key) || [];
              return (
                <KanbanColumn
                  key={column.key}
                  id={column.key}
                  title={column.title}
                  tasks={columnTasks}
                  count={columnTasks.length}
                >
                  {columnTasks.map((task) => (
                    <KanbanCard
                      key={task._id.toString()}
                      task={task}
                      id={task._id.toString()}
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <KanbanCard task={activeTask} id={activeTask._id.toString()} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
