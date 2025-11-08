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
