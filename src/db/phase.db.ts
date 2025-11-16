import { connectDb } from '@/dbConfig/dbConfig';
import Phase from '@/models/phase.model';
import { IPhaseWithPopulatedTasks } from '@/types/project.types';

export async function getProjectPhases(
  projectId: string
): Promise<IPhaseWithPopulatedTasks[] | null> {
  try {
    await connectDb();
    const phases = await Phase.find({ project: projectId }).populate('tasks');
    return JSON.parse(JSON.stringify(phases)) as IPhaseWithPopulatedTasks[];
  } catch (error) {
    console.error('Error fetching project phases:', error);
    return null;
  }
}
