import { IPhaseWithPopulatedTasks } from '@/types/project.types';

export function calculatePhaseProgress(
  phase: IPhaseWithPopulatedTasks
): number {
  if (!phase.tasks || phase.tasks.length === 0) {
    return 0;
  }

  const completedTasks = phase.tasks.filter((task) => task.status === 'done').length;
  const totalTasks = phase.tasks.length;

  return Math.round((completedTasks / totalTasks) * 100);
}

export function getPhaseTaskCounts(phase: IPhaseWithPopulatedTasks): {
  completed: number;
  total: number;
} {
  if (!phase.tasks || phase.tasks.length === 0) {
    return { completed: 0, total: 0 };
  }

  const completed = phase.tasks.filter((task) => task.status==='done').length;
  const total = phase.tasks.length;

  return { completed, total };
}

export function isPhaseCompleted(phase: IPhaseWithPopulatedTasks): boolean {
  if (!phase.tasks || phase.tasks.length === 0) {
    return false;
  }

  return phase.tasks.every((task) => task.completed);
}
