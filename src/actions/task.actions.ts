'use server';

import {
  verifyProjectAccess,
  getProjectByIdWithTasks,
  getProjectByIdPopulated,
} from '@/db/project.db';
import { connectDb } from '@/dbConfig/dbConfig';
import Task from '@/models/task.model';
import Phase from '@/models/phase.model';
import Subtask from '@/models/subtask.model';
import { TaskUpdateResponse } from '@/types/task.types';
import { revalidatePath } from 'next/cache';
import { updateTaskSchema, type UpdateTaskSchema } from '@/schemas/task.schema';
import { auth } from '@/auth';
import { taskFormSchema, TaskFormAllFields } from '@/schemas/task-form.schema';

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

    // Extract team members
    const teamMembers = [...(project.teamMember || []), project.faculty]
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

export async function createTaskAction(
  projectId: string,
  payload: TaskFormAllFields
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate input
    const validatedFields = taskFormSchema.safeParse(payload);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        success: false,
        message: 'Invalid Fields.',
      };
    }

    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();
    const project = await getProjectByIdWithTasks(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Verify phase exists in project
    const phaseExists = project.phases.some(
      (phase) => phase._id.toString() === validatedFields.data.phaseId
    );
    if (!phaseExists) {
      return {
        success: false,
        message: 'Invalid phase for this project',
      };
    }

    // Validate status
    const projectStatuses = project.taskStatuses || [];
    const statusExists = projectStatuses.some(
      (s) =>
        s.id === validatedFields.data.status ||
        s.name === validatedFields.data.status
    );
    if (!statusExists) {
      return {
        success: false,
        message: 'Invalid status for this project',
      };
    }

    // Create subtasks first (if any)
    let createdSubtaskIds: any[] = [];
    if (
      validatedFields.data.subtasks &&
      validatedFields.data.subtasks.length > 0
    ) {
      const subtasksToCreate = validatedFields.data.subtasks
        .filter((st) => st.title.trim().length >= 3) // Only create valid subtasks
        .map((st) => ({
          title: st.title,
          createdBy: session.user.id,
          completed: false,
        }));

      if (subtasksToCreate.length > 0) {
        const createdSubtasks = await Subtask.insertMany(subtasksToCreate);
        createdSubtaskIds = createdSubtasks.map((st) => st._id);
      }
    }

    // Create the task with subtask IDs
    const newTask = await Task.create({
      task: validatedFields.data.task,
      assignedTo: validatedFields.data.assignedTo,
      priority: validatedFields.data.priority,
      status: validatedFields.data.status,
      dueDate: validatedFields.data.dueDate
        ? new Date(validatedFields.data.dueDate)
        : null,
      createdBy: session.user.id,
      subtasks: createdSubtaskIds,
    });

    // Add task to phase
    await Phase.findByIdAndUpdate(validatedFields.data.phaseId, {
      $push: { tasks: newTask._id },
    });

    // Revalidate the tasks page
    revalidatePath(`/projects/${projectId}/tasks`);

    return {
      success: true,
      message: 'Task created successfully',
    };
  } catch (error) {
    console.error('Error in createTaskAction:', error);
    return {
      success: false,
      message: 'Failed to create task',
    };
  }
}

export async function updateTaskAction(
  payload: UpdateTaskSchema
): Promise<TaskUpdateResponse> {
  try {
    // Validate input
    const validatedFields = updateTaskSchema.safeParse(payload);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        success: false,
        message: 'Invalid Fields.',
      };
    }
    const { taskId, projectId, status, priority } = validatedFields.data;

    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // Verify task belongs to project
    await connectDb();
    const project = await getProjectByIdWithTasks(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Check if task exists in any phase of the project
    let taskFound = false;
    for (const phase of project.phases) {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        const taskInPhase = phase.tasks.find(
          (task) => task._id.toString() === taskId
        );
        if (taskInPhase) {
          taskFound = true;
          break;
        }
      }
    }

    if (!taskFound) {
      return {
        success: false,
        message: 'Task not found in this project',
      };
    }

    // Validate status if provided - check if it exists in project's taskStatuses
    if (status) {
      const projectStatuses = project.taskStatuses || [];
      const statusExists = projectStatuses.some(
        (s) => s.id === status || s.name === status
      );
      if (!statusExists) {
        return {
          success: false,
          message: 'Invalid status for this project',
        };
      }
    }

    // Update the task
    const updateData: { status?: string; priority?: string } = {};
    if (status) {
      updateData.status = status;
    }
    if (priority) {
      updateData.priority = priority;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .lean();

    if (!updatedTask) {
      return {
        success: false,
        message: 'Failed to update task',
      };
    }

    // Revalidate the tasks page to reflect changes
    revalidatePath(`/projects/${projectId}/tasks`);

    return {
      success: true,
      message: 'Task updated successfully',
      task: updatedTask as any, // Type assertion needed due to populated fields
    };
  } catch (error) {
    console.error('Error in updateTaskAction:', error);
    return {
      success: false,
      message: 'Failed to update task',
    };
  }
}
