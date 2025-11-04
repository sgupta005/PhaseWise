import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import { IProject } from '@/types/project.types';

export async function getUserProjects(): Promise<IProject[]> {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      console.error('No session found');
      return [];
    }

    const userId = session.user.id;

    // Connect to database and query directly
    await connectDb();

    const projects = await Project.find({
      $or: [{ teamMember: userId }, { faculty: userId }],
    })
      .populate('faculty', 'name email')
      .populate('teamMember', 'name email')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects

    // Serialize the data properly for Next.js
    return JSON.parse(JSON.stringify(projects)) as IProject[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(
  projectId: string
): Promise<IProject | null> {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      console.error('No session found');
      return null;
    }

    const userId = session.user.id;

    // Connect to database
    await connectDb();

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ teamMember: userId }, { faculty: userId }],
    })
      .populate('faculty', 'name email')
      .populate('teamMember', 'name email')
      .lean(); // Convert to plain JavaScript objects

    if (!project) {
      return null;
    }

    // Serialize the data properly for Next.js
    return JSON.parse(JSON.stringify(project)) as IProject;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
