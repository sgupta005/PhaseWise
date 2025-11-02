import { NextResponse } from 'next/server';
import {
  generateProjectPhases,
  parseRelativeDeadline,
} from '@/lib/gemini';
import { AIGenerateRequest } from '@/types/project';

export async function POST(req: Request) {
  try {
    const body: AIGenerateRequest = await req.json();
    const { title, description, techStack } = body;

    // Validate input
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tech stack is required' },
        { status: 400 }
      );
    }

    // Generate phases using Gemini AI
    const generatedPhases = await generateProjectPhases({
      title,
      description: description || '',
      techStack,
    });

    // Convert relative deadlines to ISO date strings
    const phasesWithDates = generatedPhases.map((phase) => ({
      ...phase,
      deadline: parseRelativeDeadline(phase.deadline),
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

