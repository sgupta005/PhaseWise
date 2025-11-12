import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { columns } from '@/components/task/TableColumns';
import { filterTasks, resolveFilters } from '@/lib/task/filters';
import { getProjectByIdPopulated } from '@/db/project.db';
import TaskFilters from '@/components/task/TaskFilters';
import TaskBoard from '@/components/task/TaskBoard';
import TaskTable from '@/components/task/TaskTable';
import CreateTaskWrapper from '@/components/task/CreateTaskWrapper';

export default async function ProjectTasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { projectId } = await params;
  const project = await getProjectByIdPopulated(projectId);

  // Flatten all tasks from all phases
  const allTasks = project.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseId: phase._id.toString(),
      phaseTitle: phase.title,
    }))
  );
  const filters = await resolveFilters(searchParams);
  const filteredTasks = filterTasks(allTasks, filters);

  return (
    <div className="px-6 py-4 flex flex-col">
      <TaskFilters project={project} />
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <div className="flex flex-col gap-4">
            <CreateTaskWrapper projectId={projectId} />
          </div>
          <TaskTable tasks={filteredTasks} columns={columns} />
        </TabsContent>
        <TabsContent value="board">
          <TaskBoard
            tasks={filteredTasks}
            projectId={projectId}
            taskStatuses={project.taskStatuses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
