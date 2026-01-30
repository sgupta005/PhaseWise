'use client';

import Link from 'next/link';
import { useProjectStore } from '@/stores/project.store';
import { Card } from '../ui/card';
import { IProjectWithTeamAndPhaseTitles } from '@/types/project.types';
import { Globe, Lock, Github, ExternalLink, Calendar } from 'lucide-react';
import { formatDate, isPast } from 'date-fns';
import { getInitials } from '@/lib/utils/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

function ProjectCard({ project }: { project: IProjectWithTeamAndPhaseTitles }) {
  const { setActiveProject } = useProjectStore();

  const visibleFaculty = project.faculty.slice(0, 3);
  const remainingFaculty = Math.max(0, project.faculty.length - 3);

  const visibleTeamMembers = project.teamMember.slice(0, 3);
  const remainingTeamMembers = Math.max(0, project.teamMember.length - 3);

  const visibleTechStack = project.techStack.slice(0, 3);
  const remainingTechStack = Math.max(0, project.techStack.length - 3);

  const currentPhase = project.phases.find(
    (phase) => phase.order === project.currentPhase
  );

  return (
    <div className="flex flex-col">
      <Card className="relative flex flex-col p-6 min-h-[360px] z-10">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          {/* Github and Live links */}
          <div className="flex items-center gap-4">
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="size-4" />
                <span>Code</span>
              </Link>
            )}
            {project.projectUrl && (
              <Link
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-4" />
                <span>Live</span>
              </Link>
            )}
          </div>
          {project.isPublic ? (
            <Globe className="size-4 text-muted-foreground" />
          ) : (
            <Lock className="size-4 text-muted-foreground" />
          )}
        </div>

        {/* Title */}
        <Link
          href={`/projects/${project._id}`}
          onClick={() => setActiveProject(project)}
          className="after:absolute after:inset-0 after:z-0"
        >
          <h2 className="text-xl font-semibold tracking-tight leading-tight line-clamp-2">
            {project.title}
          </h2>
        </Link>

        {/* Current Phase */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/30 dark:bg-muted py-2 px-4 justify-between ">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-blue-500 rounded-full" />
            <Link
              href={`/projects/${project._id}/phases`}
              onClick={() => setActiveProject(project)}
              className="z-10"
            >
              <h3 className="hover:underline truncate max-w-[150px] md:max-w-[250px]">
                Phase {project.currentPhase + 1}: {currentPhase?.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-4 text-muted-foreground" />
            <span
              className={cn(
                'text-xs text-muted-foreground',
                currentPhase?.deadline &&
                  isPast(new Date(currentPhase?.deadline)) &&
                  'text-destructive'
              )}
            >
              {currentPhase?.deadline &&
                formatDate(new Date(currentPhase?.deadline), 'dd MMM, yyyy')}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-between mb-4">
          {/* Faculty */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Faculty:</span>
            {visibleFaculty.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {visibleFaculty.map((faculty) => (
                    <Avatar
                      key={faculty._id.toString()}
                      className="size-7 border-2 border-card"
                    >
                      <AvatarImage src={faculty?.image} alt={faculty?.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(faculty?.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {remainingFaculty > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{remainingFaculty} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Team Members:</span>
            {visibleTeamMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {visibleTeamMembers.map((teamMember) => (
                    <Avatar
                      key={teamMember._id.toString()}
                      className="size-7 border-2 border-card"
                    >
                      <AvatarImage
                        src={teamMember?.image}
                        alt={teamMember?.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(teamMember?.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {remainingTeamMembers > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{remainingTeamMembers} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex items-center bg-background/80 border-t rounded-b-xl border-border/60 py-2 px-4 -m-6 ">
          {visibleTechStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {visibleTechStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {remainingTechStack > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{remainingTechStack} more
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export { ProjectCard };
