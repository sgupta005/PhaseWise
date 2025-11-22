import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponseSchema, geminiResponseSchema } from '@/schemas/ai.schema';
import { AIGeneratedPhase, AIGenerateRequest } from '@/types/project.types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateProjectPhases(
  projectInfo: AIGenerateRequest
): Promise<AIGeneratedPhase[]> {
  try {
    const { title, description, techStack } = projectInfo;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: geminiResponseSchema,
      },
    });

    const prompt = `You are a senior project management consultant experienced in SDLC, Agile, and full-stack system architecture.
    Objective: Using the project details, produce a realistic, actionable, and detailed plan with logical phases and tasks.
    Project Details:
    - Title: ${title}
    - Description: ${description || 'Not provided'}
    - Tech Stack: ${techStack}

    Output Requirements:
    - Follow Software Development Life Cycle (SDLC) stages — Requirements, Design, Development, Testing, Deployment, Maintenance.
    - Each phase should:
    - Have a clear, descriptive title (e.g., "Backend API Development & Integration")
    - Contain realistic deadline in relative format ("+2 weeks")
    - Contain tasks with action-oriented descriptions, priority levels, and optional due dates
    - Tasks should be granular enough to be assigned to a developer (avoid vague ones like "set up frontend")
    - Each task should optionally include a dueDate in relative format (e.g., "+3 days", "+1 week") based on the task's complexity and phase timeline
    - Use SDLC best practices tailored to the tech stack
    - Return output in valid JSON that conforms exactly to the schema`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response (Gemini with responseSchema returns valid JSON)
    const rawResponse = JSON.parse(text);

    // Validate with Zod schema for additional runtime safety
    const validatedResponse = AIResponseSchema.parse(rawResponse);

    return validatedResponse.phases;
  } catch (error) {
    console.error('Error generating phases with Gemini:', error);
    throw new Error(
      `Failed to generate phases: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function parseRelativeDeadline(relativeDeadline: string): string {
  const now = new Date();
  const match = relativeDeadline.match(/\+(\d+)\s*(day|week|month)s?/i);

  if (!match) {
    // Default to 1 week if format is invalid
    now.setDate(now.getDate() + 7);
    return now.toISOString().split('T')[0];
  }

  const amount = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'day':
      now.setDate(now.getDate() + amount);
      break;
    case 'week':
      now.setDate(now.getDate() + amount * 7);
      break;
    case 'month':
      now.setMonth(now.getMonth() + amount);
      break;
    default:
      now.setDate(now.getDate() + 7); // Default to 1 week
  }

  return now.toISOString().split('T')[0];
}
