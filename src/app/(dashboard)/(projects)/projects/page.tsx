import EmptyProjectsState from '@/components/EmptyProjectsState';
import { ProjectCard } from '@/components/project/ProjectCard';
import SearchProjects from '@/components/project/SearchProjects';
import { Button } from '@/components/ui/button';
import { getUserProjectsWithTeamAndFaculty } from '@/db/project.db';
import { filterProjects } from '@/lib/project/filterProjects';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const projects = await getUserProjectsWithTeamAndFaculty();
  const params = await searchParams;
  const searchQuery = (params.search as string) || '';

  const filteredProjects = filterProjects(projects, searchQuery);

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="flex flex-col gap-4 px-8 py-4 max-w-7xl mx-auto w-full">
      <div className="flex justify-between">
        <SearchProjects />
        <Button className="w-max ml-auto mr-0">
          <Link href="/create-project" className="flex items-center gap-2">
            <Plus /> New Project
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project._id.toString()} project={project} />
        ))}
      </div>
      {filteredProjects.length === 0 && searchQuery && (
        <div className="text-center py-8 text-muted-foreground">
          No projects found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
