import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Project, { ProjectDocument } from '@/models/project.model';
import {
  IProjectWithTeam,
  IProjectWithTasks,
  IProjectPopulated,
} from '@/types/project.types';
import { ITaskStatus } from '@/types/task.types';

export async function getUserProjectsWithTeamAndFaculty(): Promise<
  IProjectWithTeam[]
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error('No session found');
      return [];
    }

    const userId = session.user.id;

    await connectDb();

    const projects = await Project.find({
      $or: [{ teamMember: userId }, { faculty: userId }],
    })
      .populate('faculty', 'name email')
      .populate('teamMember', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Serialize the data properly for Next.js
    return JSON.parse(JSON.stringify(projects)) as IProjectWithTeam[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectByIdWithTeamAndFaculty(
  projectId: string
): Promise<IProjectWithTeam | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error('No session found');
      return null;
    }

    const userId = session.user.id;

    await connectDb();

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ teamMember: userId }, { faculty: userId }],
    })
      .populate('faculty', 'name email')
      .populate('teamMember', 'name email')
      .populate('createdBy', 'name email')
      .lean();

    if (!project) {
      return null;
    }

    // Serialize the data properly for Next.js
    return JSON.parse(JSON.stringify(project)) as IProjectWithTeam;
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

export async function getProjectById(
  projectId: string
): Promise<ProjectDocument | null> {
  await connectDb();
  return await Project.findById(projectId);
}

export async function getProjectByIdPopulated(
  projectId: string
): Promise<IProjectPopulated> {
  await connectDb();
  const project = await Project.findById(projectId)
    .populate({
      path: 'phases',
      populate: {
        path: 'tasks',
      },
    })
    .populate('faculty', 'name email')
    .populate('teamMember', 'name email')
    .populate('createdBy', 'name email')
    .lean();

  // Serialize the data properly for Next.js
  return JSON.parse(JSON.stringify(project)) as IProjectPopulated;
}

export async function getProjectByIdWithTasks(
  projectId: string
): Promise<IProjectWithTasks> {
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
