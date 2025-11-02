'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FacultySelector } from '@/components/selectors/FacultySelector';
import { TeamMemberSelector } from '@/components/selectors/TeamMemberSelector';
import { ProjectFormData } from '@/types/project.types';
import { ArrowRight } from 'lucide-react';

interface ProjectDetailsFormProps {
  formData: ProjectFormData;
  onChange: (field: keyof ProjectFormData, value: any) => void;
  onNext: () => void;
  errors: Partial<Record<keyof ProjectFormData, string>>;
}

export function ProjectDetailsForm({
  formData,
  onChange,
  onNext,
  errors,
}: ProjectDetailsFormProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Project Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Project Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter your project title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your project..."
            rows={4}
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label htmlFor="techStack">
            Tech Stack <span className="text-destructive">*</span>
          </Label>
          <Input
            id="techStack"
            placeholder="e.g., React, Node.js, MongoDB, TypeScript"
            value={formData.techStack}
            onChange={(e) => onChange('techStack', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple technologies with commas
          </p>
          {errors.techStack && (
            <p className="text-sm text-destructive">{errors.techStack}</p>
          )}
        </div>

        {/* GitHub Link */}
        <div className="space-y-2">
          <Label htmlFor="githubLink">
            GitHub Repository
            {/* <span className="text-destructive">*</span> */}
          </Label>
          <Input
            id="githubLink"
            type="url"
            placeholder="https://github.com/username/repo"
            value={formData.githubLink}
            onChange={(e) => onChange('githubLink', e.target.value)}
          />
          {/* {errors.githubLink && (
            <p className="text-sm text-destructive">{errors.githubLink}</p>
          )} */}
        </div>

        {/* Project URL (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="projectUrl">Live URL (Optional)</Label>
          <Input
            id="projectUrl"
            type="url"
            placeholder="https://your-project.com"
            value={formData.projectUrl}
            onChange={(e) => onChange('projectUrl', e.target.value)}
          />
        </div>

        {/* Faculty Selector */}
        <div className="space-y-2">
          <Label>
            Faculty Mentor <span className="text-destructive">*</span>
          </Label>
          <FacultySelector
            value={formData.faculty}
            onChange={(faculty) => onChange('faculty', faculty)}
          />
          {errors.faculty && (
            <p className="text-sm text-destructive">{errors.faculty}</p>
          )}
        </div>

        {/* Team Members Selector */}
        <div className="space-y-2">
          <Label>
            Team Members <span className="text-destructive">*</span>
          </Label>
          <TeamMemberSelector
            value={formData.teamMembers}
            onChange={(members) => onChange('teamMembers', members)}
          />
          <p className="text-xs text-muted-foreground">
            Select all students who will work on this project
          </p>
          {errors.teamMembers && (
            <p className="text-sm text-destructive">{errors.teamMembers}</p>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={onNext} size="lg">
            Next: Add Phases
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
