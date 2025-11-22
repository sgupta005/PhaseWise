import z from 'zod';
import { createPhaseTaskSchema } from './phase-form.schema';

export const projectDetailsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  techStack: z
    .string()
    .min(1, 'Please add at least one technology to the tech stack.'),
  githubLink: z.url('Please enter a valid URL').optional(),
  projectUrl: z.url('Please enter a valid URL').optional(),
  facultyId: z.string().min(1, 'Please select a faculty member.'),
  teamMemberIds: z
    .array(z.string())
    .min(1, 'Please select at least one team member.'),
});

export const phaseSchema = z.object({
  phases: z
    .array(
      z.object({
        title: z
          .string()
          .min(3, 'Phase title must be at least 3 characters long.'),
        deadline: z.string().min(1, 'Please select a deadline for the phase.'),
        tasks: z.array(createPhaseTaskSchema).optional(),
      })
    )
    .min(1, 'Please add at least one phase.'),
});

export const projectFormSchema = z.object({
  ...projectDetailsSchema.shape,
  ...phaseSchema.shape,
});

export type ProjectDetails = z.infer<typeof projectDetailsSchema>;
export type Phases = z.infer<typeof phaseSchema>;

export type ProjectFormStepData = ProjectDetails | Phases;
export type ProjectFormAllFields = ProjectDetails & Phases;
