import { ITask, GroupByMode } from '@/types/task.types';

export function groupTasks(tasks: ITask[], mode: GroupByMode = 'status') {
  return Object.entries(
    tasks.reduce(
      (acc, task) => {
        const key = mode === 'status' ? task.status : task.priority;
        acc[key] = acc[key] || [];
        acc[key].push(task);
        return acc;
      },
      {} as Record<string, ITask[]>
    )
  );
}

export function groupTasksByStatus(tasks: ITask[]) {
  return groupTasks(tasks, 'status');
}

export function groupTasksByPriority(tasks: ITask[]) {
  return groupTasks(tasks, 'priority');
}
