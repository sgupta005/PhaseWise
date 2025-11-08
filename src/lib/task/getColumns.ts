import { PRIORITIES } from '@/constants';
import { GroupByMode, ITaskStatus } from '@/types/task.types';

export function getColumns(
  groupByMode: GroupByMode,
  taskStatuses: ITaskStatus[]
): { key: string; title: string }[] {
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
