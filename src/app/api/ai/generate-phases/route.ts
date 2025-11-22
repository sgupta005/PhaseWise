import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { generateProjectPhases, parseRelativeDeadline } from '@/lib/ai/gemini';
import { AIGenerateRequest } from '@/types/project.types';
import { AIPhaseGenerationRequestSchema } from '@/schemas/phase-form.schema';

export async function POST(req: Request) {
  try {
    const body: AIGenerateRequest = await req.json();

    const parseResult = AIPhaseGenerationRequestSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { title, description, techStack } = body;

    // Generate phases using Gemini AI
    const generatedPhases = await generateProjectPhases({
      title,
      description: description || '',
      techStack,
    });

    // Convert relative deadlines to YYYY-MM-DD format and add assignedTo field
    const formattedPhases = generatedPhases.map((phase) => ({
      ...phase,
      deadline: parseRelativeDeadline(phase.deadline),
      tasks: phase.tasks.map((task) => ({
        ...task,
        assignedTo: [], // Initialize with empty array for form compatibility
        dueDate: task.dueDate ? parseRelativeDeadline(task.dueDate) : undefined,
      })),
    }));

    return NextResponse.json({
      success: true,
      phases: formattedPhases,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Zod validation errors:', error.issues);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    console.error('Error generating phases:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate phases with AI',
      },
      { status: 500 }
    );
  }
}
