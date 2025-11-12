import { ITaskWithTeam } from '@/types/task.types';

export async function resolveFilters(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const resolvedSearchParams = await searchParams;

  const phaseFilter =
    typeof resolvedSearchParams.phase === 'string'
      ? resolvedSearchParams.phase
      : undefined;
  const assigneeFilter =
    typeof resolvedSearchParams.assignee === 'string'
      ? resolvedSearchParams.assignee
      : undefined;
  const priorityFilter =
    typeof resolvedSearchParams.priority === 'string'
      ? resolvedSearchParams.priority
      : undefined;
  const createdByFilter =
    typeof resolvedSearchParams.createdBy === 'string'
      ? resolvedSearchParams.createdBy
      : undefined;
  const statusFilter =
    typeof resolvedSearchParams.status === 'string'
      ? resolvedSearchParams.status
      : undefined;
  const searchQuery =
    typeof resolvedSearchParams.search === 'string'
      ? resolvedSearchParams.search.toLowerCase()
      : undefined;

  return {
    phaseFilter,
    assigneeFilter,
    priorityFilter,
    createdByFilter,
    statusFilter,
    searchQuery,
  };
}

export function filterTasks(
  tasks: ITaskWithTeam[],
  filters: {
    phaseFilter?: string;
    assigneeFilter?: string;
    priorityFilter?: string;
    createdByFilter?: string;
    statusFilter?: string;
    searchQuery?: string;
  }
) {
  const filteredTasks = tasks.filter((task) => {
    const {
      phaseFilter,
      assigneeFilter,
      priorityFilter,
      createdByFilter,
      statusFilter,
      searchQuery,
    } = filters;

    if (searchQuery && !task.task?.toLowerCase().includes(searchQuery)) {
      return false;
    }

    if (phaseFilter && task.phaseId !== phaseFilter) {
      return false;
    }

    if (assigneeFilter && Array.isArray(task.assignedTo)) {
      if (assigneeFilter === 'none') {
        if (task.assignedTo.length > 0) return false;
      } else {
        const hasAssignee = task.assignedTo.some(
          (assignee) => assignee._id.toString() === assigneeFilter
        );
        if (!hasAssignee) return false;
      }
    }

    if (priorityFilter) {
      // Convert filter value to match database format
      const priorityMap: Record<string, string> = {
        low: 'Low Priority',
        medium: 'Medium Priority',
        high: 'High Priority',
        urgent: 'Urgent',
      };

      const expectedPriority = priorityMap[priorityFilter];
      if (task.priority !== expectedPriority) {
        return false;
      }
    }

    if (createdByFilter && task.createdBy._id.toString() !== createdByFilter) {
      return false;
    }

    if (statusFilter && task.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return filteredTasks;
}
