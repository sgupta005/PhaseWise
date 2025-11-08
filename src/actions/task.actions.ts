'use server';

import { verifyProjectAccess, getProjectByIdWithTasks } from '@/db/project.db';
import { connectDb } from '@/dbConfig/dbConfig';
import Task from '@/models/task.model';
import { TaskUpdateResponse } from '@/types/task.types';
import { revalidatePath } from 'next/cache';
import { updateTaskSchema, type UpdateTaskSchema } from '@/schemas/task.schema';

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
