import { NextResponse } from 'next/server';
import { generateProjectPhases, parseRelativeDeadline } from '@/lib/ai/gemini';
import { AIGenerateRequest } from '@/types/project.types';
import { AIPhaseGenerationRequestSchema } from '@/schemas/phase-form.schema';

export async function POST(req: Request) {
  try {
    const body: AIGenerateRequest = await req.json();

    if (!AIPhaseGenerationRequestSchema.safeParse(body).success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { title, description, techStack } = body;

    // Generate phases using Gemini AI
    const generatedPhases = await generateProjectPhases({
      title,
      description: description || '',
      techStack,
    });

    // Convert relative deadlines to ISO date strings for phases and tasks
    const phasesWithDates = generatedPhases.map((phase) => ({
      ...phase,
      deadline: parseRelativeDeadline(phase.deadline),
      tasks: phase.tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? parseRelativeDeadline(task.dueDate) : undefined,
      })),
    }));

    return NextResponse.json({
      success: true,
      phases: phasesWithDates,
    });
  } catch (error) {
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
