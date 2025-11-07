import { TaskDocument } from '@/models/task.model';
import { IProjectPopulated } from '@/types/project.types';

interface TaskBoardProps {
  tasks: (TaskDocument & { phaseId: string; phaseTitle: string })[];
  project: IProjectPopulated;
}

export default function TaskBoard({ tasks, project }: TaskBoardProps) {
  return (
    <div>
      <p>Task Board - Showing {tasks.length} tasks</p>
      {/* Task board UI will go here */}
    </div>
  );
}
