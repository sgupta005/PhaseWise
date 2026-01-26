import { notFound } from 'next/navigation';
import { getTaskByIdPopulated, verifyTaskBelongsToProject } from '@/db/task.db';
import { verifyProjectAccess, getProjectByIdPopulated } from '@/db/project.db';
import TaskDetailView from '@/components/task/TaskDetailView';
import { getProjectDataForTaskForm } from '@/db/project.db';
import { Types } from 'mongoose';

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;

  // Validate that both IDs are valid MongoDB ObjectIds
  if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
    notFound();
  }

  const [hasAccess, task, taskBelongsToProject, project] = await Promise.all([
    verifyProjectAccess(projectId),
    getTaskByIdPopulated(taskId),
    verifyTaskBelongsToProject(taskId, projectId),
    getProjectByIdPopulated(projectId),
  ]);
  if (!hasAccess || !task || !taskBelongsToProject || !project) {
    notFound();
  }

  // Find which phase this task belongs to
  let phaseTitle: string | null = null;
  let currentPhaseId: string = '';

  for (const phase of project.phases) {
    const taskInPhase = phase.tasks.find((t) => t._id.toString() === taskId);
    if (taskInPhase) {
      phaseTitle = phase.title;
      currentPhaseId = phase._id.toString();
      break;
    }
  }

  // Fetch team members for subtask assignment
  const projectData = await getProjectDataForTaskForm(projectId);
  const teamMembers = projectData.data?.teamMembers || [];

  return (
    <TaskDetailView
      task={task}
      projectId={projectId}
      phaseTitle={phaseTitle}
      currentPhaseId={currentPhaseId}
      teamMembers={teamMembers}
    />
  );
}
