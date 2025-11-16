import { getProjectPhases } from '@/db/phase.db';
import { notFound } from 'next/navigation';

export default async function ProjectPhasesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const projectPhases = await getProjectPhases(projectId);
  if (!projectPhases) {
    notFound();
  }
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-semibold">Phases</h1>
    </div>
  );
}
