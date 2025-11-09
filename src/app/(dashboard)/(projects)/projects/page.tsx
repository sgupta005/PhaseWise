import EmptyProjectsState from '@/components/EmptyProjectsState';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/button';
import { getUserProjectsWithTeamAndFaculty } from '@/db/project.db';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Projects() {
  const projects = await getUserProjectsWithTeamAndFaculty();

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <Button className="w-max ml-auto mr-0">
        <Link href="/create-project" className="flex items-center gap-2">
          <Plus /> New Project
        </Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id.toString()} project={project} />
        ))}
      </div>
    </div>
  );
}
