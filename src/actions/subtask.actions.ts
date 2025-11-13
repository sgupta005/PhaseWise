'use server';

import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Subtask from '@/models/subtask.model';
import Task from '@/models/task.model';
import { revalidatePath } from 'next/cache';
import { subtaskSchema, SubtaskFormData } from '@/schemas/subtask.schema';

interface SubtaskActionResponse {
  success: boolean;
  message: string;
}

export async function createSubtaskAction(
  taskId: string,
  projectId: string,
  subtaskData: SubtaskFormData
): Promise<SubtaskActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    const validatedFields = subtaskSchema.safeParse(subtaskData);
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid Fields.',
      };
    }

    const { title, assignedTo } = validatedFields.data;

    await connectDb();

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: 'Task not found',
      };
    }

    // Create the subtask
    const newSubtask = await Subtask.create({
      title: title.trim(),
      assignedTo: assignedTo || null,
      createdBy: session.user.id,
      completed: false,
    });

    // Add subtask to task
    await Task.findByIdAndUpdate(taskId, {
      $push: { subtasks: newSubtask._id },
    });

    // Revalidate the task detail page
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
      message: 'Subtask created successfully',
    };
  } catch (error) {
    console.error('Error in createSubtaskAction:', error);
    return {
      success: false,
      message: 'Failed to create subtask',
    };
  }
}

export async function toggleSubtaskAction(
  subtaskId: string,
  taskId: string,
  projectId: string,
  completed: boolean
): Promise<SubtaskActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    await connectDb();

    // Verify subtask exists
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
      return {
        success: false,
        message: 'Subtask not found',
      };
    }

    // Update subtask completion status
    await Subtask.findByIdAndUpdate(subtaskId, {
      completed,
    });

    // Revalidate the task detail page
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
      message: 'Subtask updated successfully',
    };
  } catch (error) {
    console.error('Error in toggleSubtaskAction:', error);
    return {
      success: false,
      message: 'Failed to update subtask',
    };
  }
}
