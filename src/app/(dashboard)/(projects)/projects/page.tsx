import CreateProjectCard from '@/components/CreateProjectCard';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { getUserProjects } from '@/db/project.db';
import { GridBeams } from '@/components/ui/grid-beams';

export default async function Projects() {
  const projects = await getUserProjects();

  return (
    <div className="p-6 lg:p-10 transition-all duration-500 ease-in-out">
      <GridBeams className="rounded-xl shadow-2xl p-8 transition-all duration-500 ease-in-out mb-10">
        <div className="flex h-48 items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-bold text-muted-foreground">
              Create and Manage Your Projects
            </h2>
            <p className="text-sm text-muted-foreground/70 mt-2">
              {projects.length > 0
                ? `You have ${projects.length} project${projects.length !== 1 ? 's' : ''}`
                : 'Start by creating your first project'}
            </p>
          </div>
        </div>
      </GridBeams>

      <div className="flex flex-wrap gap-6 w-full">
        <CreateProjectCard />

        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/projects/${project._id}`}
            className="flex gap-6"
          >
            <ProjectCard
              id={project._id || ''}
              title={project.title}
              description={project.description}
              techStack={project.techStack}
              faculty={
                typeof project.faculty === 'object'
                  ? project.faculty
                  : { name: 'Unknown', email: '' }
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
