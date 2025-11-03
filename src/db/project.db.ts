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
