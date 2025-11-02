import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AIGeneratedPhase,
  AIGenerateRequest,
  AIGeneratedTask,
} from '@/types/project';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateProjectPhases(
  projectInfo: AIGenerateRequest
): Promise<AIGeneratedPhase[]> {
  try {
    const { title, description, techStack } = projectInfo;

    // Use Gemini 1.5 Flash for speed and cost efficiency
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `You are a project management expert. Generate a detailed project breakdown following the Software Development Life Cycle (SDLC) methodology.

Project Details:
- Title: ${title}
- Description: ${description || 'Not provided'}
- Tech Stack: ${techStack.join(', ')}

Generate phases for this project. Each phase should follow SDLC principles (Planning, Design, Development, Testing, Deployment, Maintenance).

For each phase, provide:
1. A clear phase title (e.g., "Requirements Analysis and Planning")
2. A realistic deadline (expressed as relative time like "+1 week", "+2 weeks", "+1 month")
3. Generate specific, actionable tasks for that phase

For each task, include:
- A clear task description
- Priority level: "Low Priority", "Medium Priority", "High Priority", or "Urgent"

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "phases": [
    {
      "title": "Phase 1: Requirements Analysis and Planning",
      "deadline": "+1 week",
      "tasks": [
        {
          "task": "Conduct stakeholder interviews and gather requirements",
          "priority": "High Priority"
        },
        {
          "task": "Create project scope document",
          "priority": "High Priority"
        },
        {
          "task": "Define success metrics and KPIs",
          "priority": "Medium Priority"
        }
      ]
    }
  ]
}

Ensure the phases are:
- Relevant to the specific tech stack mentioned
- Ordered chronologically according to SDLC
- Realistic and achievable
- Specific to the project type (web app, mobile app, API, etc.)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedResponse;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and extract phases
    if (!parsedResponse.phases || !Array.isArray(parsedResponse.phases)) {
      throw new Error('Invalid response structure from AI');
    }

    const phases: AIGeneratedPhase[] = parsedResponse.phases.map(
      (phase: any, index: number) => ({
        title: phase.title || `Phase ${index + 1}`,
        deadline: phase.deadline || '+1 week',
        tasks: (phase.tasks || []).map((task: any) => ({
          task: task.task || '',
          priority:
            task.priority || ('Medium Priority' as AIGeneratedTask['priority']),
        })),
      })
    );

    return phases;
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
    return now.toISOString();
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

  return now.toISOString();
}
