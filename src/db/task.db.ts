import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import Task, { TaskDocument } from '@/models/task.model';
import { ITaskDetailed } from '@/types/task.types';
import { getProjectByIdWithTasks } from './project.db';

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

export async function getTaskByIdPopulated(
  taskId: string
): Promise<ITaskDetailed | null> {
  try {
    await connectDb();
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email image')
      .populate('createdBy', 'name email image')
      .populate({
        path: 'subtasks',
        populate: [
          {
            path: 'createdBy',
            select: 'name email image',
          },
        ],
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'createdBy',
          select: 'name email image',
        },
      })
      .lean();

    if (!task) {
      return null;
    }

    // Serialize the data properly for Next.js
    return JSON.parse(JSON.stringify(task)) as ITaskDetailed;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return null;
  }
}

export async function verifyTaskBelongsToProject(
  taskId: string,
  projectId: string
): Promise<boolean> {
  try {
    const project = await getProjectByIdWithTasks(projectId);
    if (!project) {
      return false;
    }

    // Check if task exists in any phase of the project
    for (const phase of project.phases) {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        const taskInPhase = phase.tasks.find(
          (task) => task._id.toString() === taskId
        );
        if (taskInPhase) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error verifying task belongs to project:', error);
    return false;
  }
}

export async function getTaskById(
  taskId: string
): Promise<TaskDocument | null> {
  try {
    await connectDb();
    const task = await Task.findById(taskId);
    return task;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return null;
  }
}
