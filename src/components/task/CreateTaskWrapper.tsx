import { getProjectDataForTaskForm } from '@/actions/task.actions';
import CreateTaskForm from './CreateTaskForm';

interface CreateTaskProps {
  projectId: string;
}

export default async function CreateTaskWrapper({
  projectId,
}: CreateTaskProps) {
  const result = await getProjectDataForTaskForm(projectId);

  if (!result.success || !result.data) {
    return null;
  }

  const { phases, teamMembers, taskStatuses } = result.data;

  return (
    <CreateTaskForm
      projectId={projectId}
      phases={phases}
      teamMembers={teamMembers}
      taskStatuses={taskStatuses}
    />
  );
}
