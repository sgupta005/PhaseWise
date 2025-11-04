import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IUser } from '@/types/project.types';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  techStack: string[];
  faculty: IUser | { name: string; email?: string };
  teamMember: IUser[] | { name: string; email?: string }[];
}

function ProjectCard({
  title,
  description,
  techStack,
  faculty,
  teamMember,
}: ProjectCardProps) {
  const projectInitials = getInitials(title);
  const projectColor = getAvatarColor(title);
  const facultyInitials = getInitials(faculty.name);
  const facultyColor = getAvatarColor(faculty.name);

  // Limit team members shown to 3
  const displayedTeamMembers = teamMember.slice(0, 3);
  const remainingCount = teamMember.length - 3;

  return (
    <div className="w-[20%] min-w-[250px] h-[40vh] rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col h-full p-5">
        {/* Top Section - Avatars Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Project Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarFallback
              className={`${projectColor} text-white font-semibold text-lg`}
            >
              {projectInitials}
            </AvatarFallback>
          </Avatar>

          {/* Faculty + Team Avatars */}
          <div className="flex items-center -space-x-2">
            {/* Faculty Avatar */}
            <Avatar className="h-8 w-8 border-2 border-card">
              <AvatarFallback
                className={`${facultyColor} text-white text-xs font-medium`}
              >
                {facultyInitials}
              </AvatarFallback>
            </Avatar>

            {/* Team Member Avatars */}
            {displayedTeamMembers.map((member, idx) => {
              const memberInitials = getInitials(member.name);
              const memberColor = getAvatarColor(member.name);
              return (
                <Avatar key={idx} className="h-8 w-8 border-2 border-card">
                  <AvatarFallback
                    className={`${memberColor} text-white text-xs font-medium`}
                  >
                    {memberInitials}
                  </AvatarFallback>
                </Avatar>
              );
            })}

            {/* Remaining Count */}
            {remainingCount > 0 && (
              <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-xl font-semibold text-foreground line-clamp-1">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {description || 'No description provided'}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto max-h-16 overflow-hidden">
          {techStack.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs font-medium">
              {tag}
            </Badge>
          ))}
          {techStack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{techStack.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
