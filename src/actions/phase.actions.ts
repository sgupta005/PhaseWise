'use server';

import { auth } from '@/auth';
import { verifyProjectAccess } from '@/db/project.db';
import { connectDb } from '@/dbConfig/dbConfig';
import Phase from '@/models/phase.model';
import Task from '@/models/task.model';
import Project from '@/models/project.model';
import { revalidatePath } from 'next/cache';
import {
  createPhaseFormSchema,
  setCurrentPhaseSchema,
  type CreatePhaseFormData,
  type SetCurrentPhaseData,
} from '@/schemas/phase-form.schema';
import mongoose from 'mongoose';

interface PhaseActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function createPhaseAction(
  projectId: string,
  payload: CreatePhaseFormData
): Promise<PhaseActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate input
    const validatedFields = createPhaseFormSchema.safeParse(payload);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        success: false,
        message: 'Invalid fields',
      };
    }

    // Verify project access
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();

    // Get the default status for new tasks
    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    const defaultStatus =
      project.taskStatuses?.find(
        (s: { isDefault: boolean; id: string }) => s.isDefault
      )?.id || 'todo';

    // Create tasks first
    const createdTasks = await Task.insertMany(
      validatedFields.data.tasks.map((task) => ({
        task: task.task,
        assignedTo: task.assignedTo,
        priority: task.priority,
        status: defaultStatus,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdBy: session.user.id,
        completed: false,
      }))
    );

    const taskIds = createdTasks.map((task) => task._id);

    // Get current phase count to set order
    const phaseCount = project.phases?.length || 0;

    // Create the phase
    const newPhase = await Phase.create({
      title: validatedFields.data.title,
      deadline: new Date(validatedFields.data.deadline),
      completed: false,
      order: phaseCount,
      tasks: taskIds,
    });

    // Add phase to project
    await Project.findByIdAndUpdate(projectId, {
      $push: { phases: newPhase._id },
    });

    revalidatePath(`/projects/${projectId}/phases`);
    revalidatePath(`/projects/${projectId}/tasks`);

    return {
      success: true,
      message: 'Phase created successfully',
      data: JSON.parse(JSON.stringify(newPhase)),
    };
  } catch (error) {
    console.error('Error creating phase:', error);
    return {
      success: false,
      message: 'Failed to create phase',
    };
  }
}

// update phase title and deadline only
export async function updatePhaseMetadataAction(
  projectId: string,
  phaseId: string,
  payload: { title: string; deadline: string }
): Promise<PhaseActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Verify project access
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();

    // Update the phase
    const phase = await Phase.findByIdAndUpdate(
      phaseId,
      {
        title: payload.title,
        deadline: new Date(payload.deadline),
      },
      { new: true }
    );

    if (!phase) {
      return {
        success: false,
        message: 'Phase not found',
      };
    }

    revalidatePath(`/projects/${projectId}/phases`);

    return {
      success: true,
      message: 'Phase updated successfully',
      data: JSON.parse(JSON.stringify(phase)),
    };
  } catch (error) {
    console.error('Error updating phase metadata:', error);
    return {
      success: false,
      message: 'Failed to update phase',
    };
  }
}

// delete phase and cascade delete all its tasks
export async function deletePhaseAction(
  projectId: string,
  phaseId: string
): Promise<PhaseActionResponse> {
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const session = await auth();
    if (!session?.user?.id) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Verify project access
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();

    // Get the project
    const project = await Project.findById(projectId).session(mongoSession);
    if (!project) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Get the phase
    const phase = await Phase.findById(phaseId).session(mongoSession);
    if (!phase) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Phase not found',
      };
    }

    // Delete all tasks in this phase
    await Task.deleteMany(
      { _id: { $in: phase.tasks } },
      { session: mongoSession }
    );

    // Remove phase from project
    await Project.findByIdAndUpdate(
      projectId,
      { $pull: { phases: phaseId } },
      { session: mongoSession }
    );

    // Delete the phase
    await Phase.findByIdAndDelete(phaseId).session(mongoSession);

    // Reorder remaining phases to maintain sequential order
    const remainingPhases = await Phase.find({
      _id: {
        $in: project.phases.filter((id: any) => id.toString() !== phaseId),
      },
    })
      .sort({ order: 1 })
      .session(mongoSession);

    // Update order for remaining phases
    for (let i = 0; i < remainingPhases.length; i++) {
      if (remainingPhases[i].order !== i) {
        await Phase.findByIdAndUpdate(
          remainingPhases[i]._id,
          { order: i },
          { session: mongoSession }
        );
      }
    }

    await mongoSession.commitTransaction();

    revalidatePath(`/projects/${projectId}/phases`);
    revalidatePath(`/projects/${projectId}/tasks`);

    return {
      success: true,
      message: 'Phase deleted successfully',
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    console.error('Error deleting phase:', error);
    return {
      success: false,
      message: 'Failed to delete phase',
    };
  } finally {
    mongoSession.endSession();
  }
}

export async function setCurrentPhaseAction(
  projectId: string,
  payload: SetCurrentPhaseData
): Promise<PhaseActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate input
    const validatedFields = setCurrentPhaseSchema.safeParse(payload);
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid phase index',
      };
    }

    // Verify project access
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();

    // Get the project
    const project = await Project.findById(projectId).populate({
      path: 'phases',
      options: { sort: { order: 1 } },
    });
    if (!project) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    // Validate phase index
    if (validatedFields.data.phaseOrder >= project.phases.length) {
      return {
        success: false,
        message: 'Invalid phase order',
      };
    }

    // Update current phase (1-indexed in the model)
    project.currentPhase = validatedFields.data.phaseOrder;
    await project.save();

    revalidatePath(`/projects/${projectId}/phases`);
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      message: 'Current phase updated successfully',
    };
  } catch (error) {
    console.error('Error setting current phase:', error);
    return {
      success: false,
      message: 'Failed to set current phase',
    };
  }
}

export async function reorderPhasesAction(
  projectId: string,
  phaseIds: string[]
): Promise<PhaseActionResponse> {
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const session = await auth();
    if (!session?.user?.id) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Verify project access
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    await connectDb();

    // Validate that all phases belong to the project
    const project = await Project.findById(projectId).session(mongoSession);
    if (!project) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Project not found',
      };
    }

    const projectPhaseIds = project.phases.map((id: any) => id.toString());
    const allPhasesValid = phaseIds.every((id) => projectPhaseIds.includes(id));

    if (!allPhasesValid || phaseIds.length !== projectPhaseIds.length) {
      await mongoSession.abortTransaction();
      return {
        success: false,
        message: 'Invalid phase IDs provided',
      };
    }

    // Update order for each phase
    for (let i = 0; i < phaseIds.length; i++) {
      await Phase.findByIdAndUpdate(
        phaseIds[i],
        { order: i },
        { session: mongoSession }
      );
    }

    await mongoSession.commitTransaction();

    revalidatePath(`/projects/${projectId}/phases`);

    return {
      success: true,
      message: 'Phases reordered successfully',
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    console.error('Error reordering phases:', error);
    return {
      success: false,
      message: 'Failed to reorder phases',
    };
  } finally {
    mongoSession.endSession();
  }
}
