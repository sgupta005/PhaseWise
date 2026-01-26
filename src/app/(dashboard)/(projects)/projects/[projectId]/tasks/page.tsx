import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import { columns } from '@/components/task/TableColumns';
import { filterTasks, resolveFilters } from '@/lib/task/filters';
import { getProjectByIdPopulated } from '@/db/project.db';

import TaskFilters from '@/components/task/TaskFilters';
import TaskBoard from '@/components/task/TaskBoard';
import TaskTable from '@/components/task/TaskTable';
import CreateTaskForm from '@/components/task/CreateTaskForm';

export default async function ProjectTasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Fetch project data and resolve filters in parallel
  const [{ projectId }, filters] = await Promise.all([
    params,
    resolveFilters(searchParams),
  ]);

  const project = await getProjectByIdPopulated(projectId);

  if (!project) {
    return notFound();
  }

  // Extract phases, team members, and statuses from the already-fetched project
  const phases = project.phases.map((phase) => ({
    _id: phase._id.toString(),
    title: phase.title,
  }));

  const teamMembers = [
    ...(project.teamMember || []),
    ...(project.faculty || []),
  ]
    .filter(Boolean)
    .map((member) => ({
      _id: member._id.toString(),
      name: member.name,
      email: member.email,
    }));

  const taskStatuses = project.taskStatuses || [];

  // Flatten all tasks from all phases
  const allTasks = project.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseId: phase._id.toString(),
      phaseTitle: phase.title,
    })),
  );

  const filteredTasks = filterTasks(allTasks, filters);

  return (
    <div className="py-4 px-6 flex flex-col max-w-7xl mx-auto">
      <TaskFilters project={project} />
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="flex flex-col gap-4">
            <CreateTaskForm
              projectId={projectId}
              phases={phases}
              teamMembers={teamMembers}
              taskStatuses={taskStatuses}
            />
          </div>
          <TaskTable tasks={filteredTasks} columns={columns} />
        </TabsContent>
        <TabsContent value="board">
          <TaskBoard
            tasks={filteredTasks}
            projectId={projectId}
            taskStatuses={taskStatuses}
            phases={phases}
            teamMembers={teamMembers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
