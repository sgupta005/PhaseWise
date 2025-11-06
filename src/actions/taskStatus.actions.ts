'use server';

import {
  verifyProjectAccess,
  getProjectById,
  getProjectByIdWithTasks,
} from '@/db/project.db';
import { ITaskStatus, StatusOperationResponse } from '@/types/task.types';

export async function createStatusAction(
  projectId: string,
  name: string
): Promise<StatusOperationResponse> {
  try {
    // Auth check
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // Validation
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        message: 'Status name is required',
      };
    }

    // DB operations
    const project = await getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Check if a status with the same name already exists
    const existingStatus = project.taskStatuses.find(
      (s: ITaskStatus) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (existingStatus) {
      return {
        success: false,
        message: 'A status with this name already exists',
      };
    }

    // Generate a unique ID for the status
    const statusId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Create new status
    const newStatus: ITaskStatus = {
      id: statusId,
      name: name.trim(),
      isDefault: false,
    };

    project.taskStatuses.push(newStatus);
    await project.save();

    return {
      success: true,
      message: 'Status created successfully',
      status: newStatus,
    };
  } catch (error) {
    console.error('Error in createStatusAction:', error);
    return {
      success: false,
      message: 'Failed to create status',
    };
  }
}

export async function updateStatusAction(
  projectId: string,
  statusId: string,
  name: string
): Promise<StatusOperationResponse> {
  try {
    // Auth check
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // Validation
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        message: 'Status name is required',
      };
    }

    // DB operations
    const project = await getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Find the status to update
    const statusIndex = project.taskStatuses.findIndex(
      (s: ITaskStatus) => s.id === statusId
    );
    if (statusIndex === -1) {
      return {
        success: false,
        message: 'Status not found',
      };
    }

    // Check if another status with the same name already exists
    const existingStatus = project.taskStatuses.find(
      (s: ITaskStatus, index: number) =>
        s.name.toLowerCase() === name.toLowerCase() && index !== statusIndex
    );
    if (existingStatus) {
      return {
        success: false,
        message: 'A status with this name already exists',
      };
    }

    // Update the status name
    project.taskStatuses[statusIndex].name = name.trim();
    await project.save();

    return {
      success: true,
      message: 'Status updated successfully',
      status: project.taskStatuses[statusIndex],
    };
  } catch (error) {
    console.error('Error in updateStatusAction:', error);
    return {
      success: false,
      message: 'Failed to update status',
    };
  }
}

export async function deleteStatusAction(
  projectId: string,
  statusId: string
): Promise<StatusOperationResponse> {
  try {
    // Auth check
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // DB operations - get project with tasks populated
    const project = await getProjectByIdWithTasks(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Find the status to delete
    const statusIndex = project.taskStatuses.findIndex(
      (s: ITaskStatus) => s.id === statusId
    );
    if (statusIndex === -1) {
      return {
        success: false,
        message: 'Status not found',
      };
    }

    const statusToDelete = project.taskStatuses[statusIndex];

    // Validation 1: Ensure it's not the last status
    if (project.taskStatuses.length === 1) {
      return {
        success: false,
        message:
          'Cannot delete the last status. Project must have at least one status.',
      };
    }

    // Validation 2: Ensure it's not the default status
    if (statusToDelete.isDefault) {
      return {
        success: false,
        message:
          'Cannot delete the default status. Please set another status as default first.',
      };
    }

    // Validation 3: Check if any tasks are using this status
    let tasksUsingStatus = 0;
    for (const phase of project.phases) {
      if (phase.tasks && Array.isArray(phase.tasks)) {
        for (const task of phase.tasks) {
          if (task.status === statusId) {
            tasksUsingStatus++;
          }
        }
      }
    }

    if (tasksUsingStatus > 0) {
      return {
        success: false,
        message: `Cannot delete status. ${tasksUsingStatus} task(s) are currently using this status.`,
      };
    }

    // All validations passed, delete the status
    project.taskStatuses.splice(statusIndex, 1);
    await project.save();

    return {
      success: true,
      message: 'Status deleted successfully',
      statuses: project.taskStatuses,
    };
  } catch (error) {
    console.error('Error in deleteStatusAction:', error);
    return {
      success: false,
      message: 'Failed to delete status',
    };
  }
}

export async function setDefaultStatusAction(
  projectId: string,
  statusId: string
): Promise<StatusOperationResponse> {
  try {
    // Auth check
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // DB operations
    const project = await getProjectById(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Find the status to set as default
    const statusIndex = project.taskStatuses.findIndex(
      (s: ITaskStatus) => s.id === statusId
    );
    if (statusIndex === -1) {
      return {
        success: false,
        message: 'Status not found',
      };
    }

    // Set all statuses to not default, then set the selected one as default
    project.taskStatuses.forEach((s: ITaskStatus, index: number) => {
      s.isDefault = index === statusIndex;
    });

    await project.save();

    return {
      success: true,
      message: 'Default status updated successfully',
      status: project.taskStatuses[statusIndex],
    };
  } catch (error) {
    console.error('Error in setDefaultStatusAction:', error);
    return {
      success: false,
      message: 'Failed to set default status',
    };
  }
}
