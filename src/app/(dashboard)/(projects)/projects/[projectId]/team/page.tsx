import { notFound } from 'next/navigation';
import { getProjectByIdWithTeamAndFaculty } from '@/db/project.db';
import { TeamPageClient } from '@/components/team/TeamPageClient';

export default async function ProjectTeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectByIdWithTeamAndFaculty(projectId);

  if (!project) {
    notFound();
  }

  return <TeamPageClient project={project} />;
}
