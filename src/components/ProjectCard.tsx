import Image from 'next/image';
import React from 'react';
import logo from '../../public/logo.svg';
import { Badge } from '@/components/ui/badge';
import { IUser } from '@/types/project.types';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  techStack: string[];
  faculty: IUser | { name: string; email?: string };
}

function ProjectCard({
  title,
  description,
  techStack,
  faculty,
}: ProjectCardProps) {
  return (
    <div className="relative w-[20%] min-w-[250px] h-[40vh] p-[1px] rounded-2xl group hover:scale-[1.03] transition-transform duration-300 ease-out">
      {/* Outer border with blur and subtle gradient */}
      <div className="absolute inset-0 rounded-2xl border border-border bg-gradient-to-br from-card/70 to-card/50 shadow-lg backdrop-blur-md"></div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full bg-card/40 rounded-2xl p-4">
        {/* Top Section - Logo */}
        <div className="flex mb-3">
          <Image
            src={logo}
            width={80}
            height={80}
            alt="Project Logo"
            className="object-contain"
          />
        </div>

        {/* Project Info */}
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-lg font-semibold tracking-wide text-foreground line-clamp-1">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {description || 'No description provided'}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3 max-h-16 overflow-hidden">
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

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-4 italic truncate">
          Faculty: {faculty.name}
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
