import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';

export async function getProjectPhases(
  projectId: string
): Promise<IPhaseWithPopulatedTasks[] | null> {
  try {
    await connectDb();
    const project = await Project.findById(projectId).populate({
      path: 'phases',
      populate: {
        path: 'tasks',
        populate: {
          path: 'assignedTo createdBy',
          select: 'name email',
        },
      },
    });

    if (!project) {
      return null;
    }

    return JSON.parse(
      JSON.stringify(project.phases)
    ) as IPhaseWithPopulatedTasks[];
  } catch (error) {
    console.error('Error fetching project phases:', error);
    return null;
  }
}
