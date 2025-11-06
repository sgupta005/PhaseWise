import { notFound } from 'next/navigation';
import { getProjectByIdWithTeamAndFaculty } from '@/db/project.db';
import ProjectLayoutClient from './layout-client';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectByIdWithTeamAndFaculty(projectId);

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayoutClient project={project}>{children}</ProjectLayoutClient>
  );
}
