import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';

export async function getProjectPhasesWithTasks(projectId: string) {
  try {
    await connectDb();
    const project = await Project.findById(projectId).populate({
      path: 'phases',
      populate: {
        path: 'tasks',
      },
    });
    return project;
  } catch (error) {
    console.error('Error fetching project phases with tasks:', error);
    return null;
  }
}
