'use server';

import { verifyProjectAccess, getProjectByIdWithTasks } from '@/db/project.db';
import { connectDb } from '@/dbConfig/dbConfig';
import Task from '@/models/task.model';
import Phase from '@/models/phase.model';
import Subtask from '@/models/subtask.model';
import Comment from '@/models/comment.model';
import { TaskUpdateResponse } from '@/types/task.types';
import { revalidatePath } from 'next/cache';
import {
  updateTaskSchema,
  type UpdateTaskSchema,
  editTaskDetailsSchema,
  type EditTaskDetailsSchema,
} from '@/schemas/task.schema';
import { auth } from '@/auth';
import { taskFormSchema, TaskFormAllFields } from '@/schemas/task-form.schema';
import { sendTaskAssignmentNotification } from '@/lib/notifications/notification';
import User from '@/models/user.model';

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

    // Create notifications for assignees
    if (validatedFields.data.assignedTo.length > 0) {
      for (const assignee of validatedFields.data.assignedTo) {
        const assigneeUser = await User.findById(assignee);
        if (assigneeUser) {
          await sendTaskAssignmentNotification({
            taskId: newTask._id.toString(),
            taskTitle: validatedFields.data.task,
            projectId: projectId,
            projectName: project.title,
            assigneeId: assigneeUser._id.toString(),
            assigneeName: assigneeUser.name,
            assigneeEmail: assigneeUser.email,
            assignedById: session.user.id,
            assignedByName: session.user.name || '',
            priority: validatedFields.data.priority,
            dueDate: validatedFields.data.dueDate
              ? new Date(validatedFields.data.dueDate)
              : null,
          });
        }
      }
    }

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

export async function editTaskDetailsAction(
  payload: EditTaskDetailsSchema
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate input
    const validatedFields = editTaskDetailsSchema.safeParse(payload);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        success: false,
        message: 'Invalid Fields.',
      };
    }

    const {
      taskId,
      projectId,
      task,
      phaseId,
      priority,
      status,
      assignedTo,
      dueDate,
    } = validatedFields.data;

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

    // Find current phase of the task
    let currentPhaseId = null;
    for (const phase of project.phases) {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        const taskInPhase = phase.tasks.find(
          (t) => t._id.toString() === taskId
        );
        if (taskInPhase) {
          currentPhaseId = phase._id.toString();
          break;
        }
      }
    }

    if (!currentPhaseId) {
      return {
        success: false,
        message: 'Task not found in this project',
      };
    }

    // Verify new phase exists in project
    const phaseExists = project.phases.some(
      (phase) => phase._id.toString() === phaseId
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
      (s) => s.id === status || s.name === status
    );
    if (!statusExists) {
      return {
        success: false,
        message: 'Invalid status for this project',
      };
    }

    // Handle phase migration if phaseId changed
    if (currentPhaseId !== phaseId) {
      // Remove task from old phase
      await Phase.findByIdAndUpdate(currentPhaseId, {
        $pull: { tasks: taskId },
      });

      // Add task to new phase
      await Phase.findByIdAndUpdate(phaseId, {
        $push: { tasks: taskId },
      });
    }

    // Update the task
    const updateData: any = {
      task,
      priority,
      status,
      assignedTo,
    };

    if (dueDate) {
      updateData.dueDate = new Date(dueDate);
    } else {
      updateData.dueDate = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return {
        success: false,
        message: 'Failed to update task',
      };
    }

    // Create notifications for assignees
    if (validatedFields.data.assignedTo.length > 0) {
      for (const assignee of validatedFields.data.assignedTo) {
        const assigneeUser = await User.findById(assignee);
        if (assigneeUser) {
          await sendTaskAssignmentNotification({
            taskId: updatedTask._id.toString(),
            taskTitle: updatedTask.task || '',
            projectId: projectId,
            projectName: project.title,
            assigneeId: assigneeUser._id.toString(),
            assigneeName: assigneeUser.name,
            assigneeEmail: assigneeUser.email,
            assignedById: session.user.id,
            assignedByName: session.user.name || '',
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
          });
        }
      }
    }

    // Revalidate the tasks page and task detail page
    revalidatePath(`/projects/${projectId}/tasks`);
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
      message: 'Task updated successfully',
    };
  } catch (error) {
    console.error('Error in editTaskDetailsAction:', error);
    return {
      success: false,
      message: 'Failed to update task',
    };
  }
}

export async function deleteTaskAction(
  taskId: string,
  projectId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
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

    // Verify task exists and belongs to project
    const project = await getProjectByIdWithTasks(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Find which phase contains this task
    let phaseId = null;
    for (const phase of project.phases) {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        const taskInPhase = phase.tasks.find(
          (task) => task._id.toString() === taskId
        );
        if (taskInPhase) {
          phaseId = phase._id;
          break;
        }
      }
    }

    if (!phaseId) {
      return {
        success: false,
        message: 'Task not found in this project',
      };
    }

    // Get the task to find its subtasks
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: 'Task not found',
      };
    }

    // Delete all subtasks associated with this task
    if (task.subtasks && task.subtasks.length > 0) {
      await Subtask.deleteMany({ _id: { $in: task.subtasks } });
    }

    // Delete all comments associated with this task
    if (task.comments && task.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: task.comments } });
    }

    // Remove task from phase
    await Phase.findByIdAndUpdate(phaseId, {
      $pull: { tasks: taskId },
    });

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Revalidate the tasks page
    revalidatePath(`/projects/${projectId}/tasks`);
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
      message: 'Task deleted successfully',
    };
  } catch (error) {
    console.error('Error in deleteTaskAction:', error);
    return {
      success: false,
      message: 'Failed to delete task',
    };
  }
}

//updates task status or priority (used in kanban board)
export async function updateTaskAction(
  payload: UpdateTaskSchema
): Promise<TaskUpdateResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }
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

export async function toggleTaskCompleted(taskId: string, projectId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    if (!taskId || !projectId) {
      return { success: false, message: 'Task id is required.' };
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        $or: [{ createdBy: session.user.id }, { assignedTo: session.user.id }],
      },
      [
        {
          $set: {
            completed: { $not: '$completed' },
          },
        },
      ],
      { new: true }
    );
    if (!task) {
      return {
        success: false,
        message: 'Task not found or you do not have permission.',
      };
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
    return {
      success: true,
      message: 'Task completed status toggled successfully.',
      task: task,
    };
  } catch (error) {
    console.error('Error in markTaskAsCompleted:', error);
    return { success: false, message: 'Failed to mark task as completed.' };
  }
}
