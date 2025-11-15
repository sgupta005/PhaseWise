import { PRIORITIES } from '@/constants';
import { z } from 'zod';

export const updateTaskSchema = z
  .object({
    taskId: z.string().min(1, 'Task ID is required'),
    projectId: z.string().min(1, 'Project ID is required'),
    status: z.string().optional(),
    priority: z.enum(PRIORITIES).optional(),
  })
  .refine(
    (data) => {
      return data.status || data.priority;
    },
    {
      message: 'Either status or priority must be provided',
    }
  );

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export const editTaskDetailsSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  task: z.string().min(3, 'Task name must be at least 3 characters'),
  phaseId: z.string().min(1, 'Phase is required'),
  priority: z.enum(PRIORITIES),
  status: z.string().min(1, 'Status is required'),
  assignedTo: z.array(z.string()),
  dueDate: z.string().optional(),
});

export type EditTaskDetailsSchema = z.infer<typeof editTaskDetailsSchema>;
