export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-semibold">Tasks</h1>
    </div>
  );
}
