import z from 'zod';

export const AIPhaseGenerationRequestSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  techStack: z.array(z.string()).min(1, 'Tech stack is required'),
});

export type AIPhaseGenerationRequest = z.infer<
  typeof AIPhaseGenerationRequestSchema
>;
