import { columns } from '@/components/task/TableColumns';
import TaskBoard from '@/components/task/TaskBoard';
import TaskFilters from '@/components/task/TaskFilters';
import TaskTable from '@/components/task/TaskTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProjectByIdPopulated } from '@/db/project.db';

export default async function ProjectTasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { projectId } = await params;
  const project = await getProjectByIdPopulated(projectId);

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

  // Flatten all tasks from all phases
  const allTasks = project.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseId: phase._id.toString(),
      phaseTitle: phase.title,
    }))
  );

  const filteredTasks = allTasks.filter((task) => {
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

  return (
    <div className="px-6 py-4 flex flex-col">
      <TaskFilters project={project} />
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
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
