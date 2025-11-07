import { ITask } from '@/types/task.types';

interface TaskBoardProps {
  tasks: ITask[];
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
  return (
    <div>
      <p>Task Board - Showing {tasks.length} tasks</p>
      {/* Task board UI will go here */}
    </div>
  );
}
