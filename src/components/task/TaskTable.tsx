import { TaskDocument } from '@/models/task.model';
import { IProjectPopulated } from '@/types/project.types';

interface TaskTableProps {
  tasks: (TaskDocument & { phaseId: string; phaseTitle: string })[];
  project: IProjectPopulated;
}

export default function TaskTable({ tasks, project }: TaskTableProps) {
  return (
    <div>
      <p>Task Table - Showing {tasks.length} tasks</p>
      {/* Task table UI will go here */}
    </div>
  );
}
