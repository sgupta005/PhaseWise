import z from 'zod';

export const subtaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
});

export type SubtaskFormData = z.infer<typeof subtaskSchema>;
