import * as z from 'zod';
import { PRIORITIES } from '@/constants';

export const createPhaseTaskSchema = z.object({
  task: z.string().min(3, 'Task must be at least 3 characters'),
  assignedTo: z.array(z.string()),
  priority: z.enum(PRIORITIES),
  dueDate: z.string().optional(),
});

export const createPhaseFormSchema = z.object({
  title: z.string().min(3, 'Phase title must be at least 3 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
  tasks: z.array(createPhaseTaskSchema),
});

export const editPhaseFormSchema = z.object({
  title: z.string().min(3, 'Phase title must be at least 3 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
});

export const setCurrentPhaseSchema = z.object({
  phaseOrder: z.number().min(0, 'Invalid phase order'),
});

// AI Phase Generation Request Schema
export const AIPhaseGenerationRequestSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  techStack: z.array(z.string()).min(1, 'Tech stack is required'),
});

export type CreatePhaseTask = z.infer<typeof createPhaseTaskSchema>;
export type CreatePhaseFormData = z.infer<typeof createPhaseFormSchema>;
export type EditPhaseFormData = z.infer<typeof editPhaseFormSchema>;
export type SetCurrentPhaseData = z.infer<typeof setCurrentPhaseSchema>;
export type AIPhaseGenerationRequest = z.infer<
  typeof AIPhaseGenerationRequestSchema
>;
