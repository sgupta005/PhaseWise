'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, ExternalLink, Lock, Globe } from 'lucide-react';
import Link from 'next/link';
import { useProjectStore } from '@/stores/project.store';
import { getInitials } from '@/lib/utils/avatar';
import { IProjectWithTeam } from '@/types/project.types';

export function ProjectCard({ project }: { project: IProjectWithTeam }) {
  const { setActiveProject } = useProjectStore();

  return (
    <Link
      href={`/projects/${project._id}`}
      className="block h-auto w-auto"
      onClick={() => setActiveProject(project)}
    >
      <Card className="group h-full w-full transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1.5 truncate">
                {project.title}
              </CardTitle>
              {project.description && (
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {project.isPublic ? (
                <Globe className="size-4 text-muted-foreground" />
              ) : (
                <Lock className="size-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.techStack.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3">
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
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
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-4" />
                <span>Live</span>
              </Link>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex flex-col gap-3 w-full items-start">
          {/* Faculty */}
          {project.faculty && project.faculty.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.faculty.slice(0, 2).map((faculty) => (
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
                {project.faculty.length > 2 && (
                  <Avatar className="size-7 border-2 border-card">
                    <AvatarFallback className="text-xs bg-muted">
                      +{project.faculty.length - 2}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {project.faculty.length}{' '}
                {project.faculty.length === 1 ? 'mentor' : 'mentors'}
              </span>
            </div>
          )}

          {/* Team Members */}
          {project.teamMember && project.teamMember.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.teamMember.slice(0, 3).map((member) => (
                  <Avatar
                    key={member._id.toString()}
                    className="size-7 border-2 border-card"
                  >
                    <AvatarImage src={member?.image} alt={member?.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.teamMember.length > 3 && (
                  <Avatar className="size-7 border-2 border-card">
                    <AvatarFallback className="text-xs bg-muted">
                      +{project.teamMember.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {project.teamMember.length}{' '}
                {project.teamMember.length === 1 ? 'member' : 'members'}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
