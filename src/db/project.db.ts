import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import { IProject } from '@/types/project.types';
import { ITaskStatus } from '@/types/task.types';

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

export async function getPopulatedProjectById(
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

export async function verifyProjectAccess(projectId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  await connectDb();

  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { teamMember: session.user.id },
      { faculty: session.user.id },
      { createdBy: session.user.id },
    ],
  });

  return !!project;
}

export async function getProjectById(projectId: string) {
  await connectDb();
  return await Project.findById(projectId);
}

export async function getProjectWithTasks(projectId: string) {
  await connectDb();
  return await Project.findById(projectId).populate({
    path: 'phases',
    populate: {
      path: 'tasks',
    },
  });
}

export async function getProjectStatuses(
  projectId: string
): Promise<ITaskStatus[]> {
  await connectDb();
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  return project.taskStatuses || [];
}
