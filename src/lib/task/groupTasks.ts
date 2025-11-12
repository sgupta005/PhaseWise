import { ITaskWithTeam, GroupByMode } from '@/types/task.types';

export function groupTasks(
  tasks: ITaskWithTeam[],
  mode: GroupByMode = 'status'
) {
  return Object.entries(
    tasks.reduce(
      (acc, task) => {
        const key = mode === 'status' ? task.status : task.priority;
        acc[key] = acc[key] || [];
        acc[key].push(task);
        return acc;
      },
      {} as Record<string, ITaskWithTeam[]>
    )
  );
}

export function groupTasksByStatus(tasks: ITaskWithTeam[]) {
  return groupTasks(tasks, 'status');
}

export function groupTasksByPriority(tasks: ITaskWithTeam[]) {
  return groupTasks(tasks, 'priority');
}
