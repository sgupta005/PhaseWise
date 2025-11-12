import * as z from 'zod';
import { PRIORITIES } from '@/constants';

export const taskDetailsSchema = z.object({
  phaseId: z.string().min(1, 'Please select a phase'),
  task: z.string().min(5, 'Task must be at least 5 characters.'),
  assignedTo: z.array(z.string()),
  priority: z.enum(PRIORITIES),
  status: z.string().min(1, 'Please select a status'),
  dueDate: z.string().optional(),
});

export const subtaskSchema = z.object({
  subtasks: z.array(
    z.object({
      title: z.string().min(3, 'Subtask title must be at least 3 characters'),
      assignedTo: z.string().optional(), // Single user ID (model has single assignedTo)
    })
  ),
});

export const taskFormSchema = z.object({
  ...taskDetailsSchema.shape,
  ...subtaskSchema.shape,
});

export type TaskDetails = z.infer<typeof taskDetailsSchema>;
export type Subtasks = z.infer<typeof subtaskSchema>;

export type TaskFormStepData = TaskDetails | Subtasks;
export type TaskFormAllFields = TaskDetails & Subtasks;
