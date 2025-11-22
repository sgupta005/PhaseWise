import { z } from 'zod';
import { SchemaType, type Schema } from '@google/generative-ai';

const AIGeneratedTaskSchema = z.object({
  task: z.string().min(1, 'Task description is required'),
  priority: z.enum([
    'Low Priority',
    'Medium Priority',
    'High Priority',
    'Urgent',
  ]),
  dueDate: z
    .string()
    .regex(/\+\d+\s*(day|week|month)s?/i, 'Invalid dueDate format')
    .nullable()
    .optional(),
});

const AIGeneratedPhaseSchema = z.object({
  title: z.string().min(1, 'Phase title is required'),
  deadline: z
    .string()
    .regex(/\+\d+\s*(day|week|month)s?/i, 'Invalid deadline format'),
  tasks: z
    .array(AIGeneratedTaskSchema)
    .min(1, 'At least one task is required per phase'),
});

export const AIResponseSchema = z.object({
  phases: z
    .array(AIGeneratedPhaseSchema)
    .min(1, 'At least one phase is required'),
});

// JSON Schema for Gemini's responseSchema parameter
export const geminiResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    phases: {
      type: SchemaType.ARRAY,
      description: 'List of project phases following SDLC methodology',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description:
              'Clear, descriptive title of the phase WITHOUT any prefix like "Phase 1:" or "Phase 2:" - just the actual phase name',
          },
          deadline: {
            type: SchemaType.STRING,
            description:
              'Relative deadline in format: +N day|week|month (e.g., "+2 weeks")',
          },
          tasks: {
            type: SchemaType.ARRAY,
            description: 'List of tasks for this phase',
            items: {
              type: SchemaType.OBJECT,
              properties: {
                task: {
                  type: SchemaType.STRING,
                  description: 'Clear, actionable task description',
                },
                priority: {
                  type: SchemaType.STRING,
                  description: 'Priority level of the task',
                  enum: [
                    'Low Priority',
                    'Medium Priority',
                    'High Priority',
                    'Urgent',
                  ],
                  format: 'enum',
                },
                dueDate: {
                  type: SchemaType.STRING,
                  description:
                    'Optional relative due date in format: +N day|week|month (e.g., "+3 days", "+1 week")',
                  nullable: true,
                },
              },
              required: ['task', 'priority'],
            },
          },
        },
        required: ['title', 'deadline', 'tasks'],
      },
    },
  },
  required: ['phases'],
};
