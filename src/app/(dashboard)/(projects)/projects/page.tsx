import CreateProjectCard from '@/components/CreateProjectCard';
import ProjectCard from '@/components/ProjectCard';
import { GridBeams } from '@/components/ui/grid-beams';
import Link from 'next/link';

export default async function Projects() {
  const projects = [
    { name: 'Ecommerce', slug: 'ecommerce' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'Project Name', slug: 'projectname' },
  ];

  return (
    <div className="p-6 lg:p-10 transition-all duration-500 ease-in-out">
      <GridBeams className="rounded-xl shadow-2xl p-8 transition-all duration-500 ease-in-out mb-10">
        <div className="flex h-48 items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Create and Manage Your Projects
          </h2>
        </div>
      </GridBeams>

      {/* Project Cards */}
      <div className="flex flex-wrap gap-6 w-full">
        {/* Create new project card */}
        <CreateProjectCard />

        {/* Existing projects */}
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="flex gap-6"
          >
            <ProjectCard title={project.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}
