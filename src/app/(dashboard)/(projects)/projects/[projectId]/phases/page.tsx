import { getProjectPhases } from '@/db/phase.db';
import { notFound } from 'next/navigation';
import { PhasesPageClient } from '@/components/phase/PhasesPageClient';
import { getProjectByIdWithTeamAndFaculty } from '@/db/project.db';
import { EmptyPhaseState } from '@/components/phase/EmptyPhaseState';

export default async function ProjectPhasesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const phases = await getProjectPhases(projectId);
  const project = await getProjectByIdWithTeamAndFaculty(projectId);

  if (!phases || !project) {
    notFound();
  }

  if (phases.length === 0) {
    return (
      <EmptyPhaseState projectId={projectId} teamMembers={project.teamMember} />
    );
  }

  return (
    <div className="px-6 py-4 mx-auto max-w-7xl">
      <PhasesPageClient
        projectId={projectId}
        phases={phases}
        project={project}
      />
    </div>
  );
}
