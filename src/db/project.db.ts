import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Project, { ProjectDocument } from '@/models/project.model';
import {
  IProjectWithTeamAndPhaseTitles,
  IProjectWithTeam,
  IProjectWithTasks,
  IProjectPopulated,
} from '@/types/project.types';
import { ITaskStatus } from '@/types/task.types';

export async function getUserProjects(): Promise<
  IProjectWithTeamAndPhaseTitles[]
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
      .populate('phases', 'title order deadline')
      .sort({ createdAt: -1 })
      .lean();

    // Serialize the data properly for Next.js
    return JSON.parse(
      JSON.stringify(projects)
    ) as IProjectWithTeamAndPhaseTitles[];
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
  const project = await Project.findById(projectId);
  if (!project) {
    return null;
  }
  return JSON.parse(JSON.stringify(project)) as ProjectDocument;
}

export async function getProjectByIdPopulated(
  projectId: string
): Promise<IProjectPopulated> {
  await connectDb();
  const project = await Project.findById(projectId)
    .populate({
      path: 'phases',
      options: { sort: { order: 1 } },
      populate: {
        path: 'tasks',
        populate: {
          path: 'assignedTo createdBy',
        },
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
  const project = await Project.findById(projectId).populate({
    path: 'phases',
    options: { sort: { order: 1 } },
    populate: {
      path: 'tasks',
    },
  });
  return JSON.parse(JSON.stringify(project)) as IProjectWithTasks;
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

export async function getProjectDataForTaskForm(projectId: string) {
  try {
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
        data: null,
      };
    }

    const project = await getProjectByIdPopulated(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
        data: null,
      };
    }

    // Extract phases with only id and title
    const phases = project.phases.map((phase) => ({
      _id: phase._id.toString(),
      title: phase.title,
    }));

    // Extract team members (students + faculty)
    const teamMembers = [
      ...(project.teamMember || []),
      ...(project.faculty || []),
    ]
      .filter(Boolean)
      .map((member) => ({
        _id: member._id.toString(),
        name: member.name,
        email: member.email,
      }));

    // Get task statuses
    const taskStatuses = project.taskStatuses || [];

    return {
      success: true,
      message: 'Project data fetched successfully',
      data: {
        phases,
        teamMembers,
        taskStatuses,
      },
    };
  } catch (error) {
    console.error('Error in getProjectDataForTaskForm:', error);
    return {
      success: false,
      message: 'Failed to fetch project data',
      data: null,
    };
  }
}
