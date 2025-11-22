'use server';

import { auth } from '@/auth';
import {
  ProjectFormAllFields,
  projectFormSchema,
} from '@/schemas/project-form.schema';
import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import Phase from '@/models/phase.model';
import Task from '@/models/task.model';
import mongoose from 'mongoose';

export async function createProjectAction(payload: ProjectFormAllFields) {
  // Start a session for transaction support
  let session: mongoose.ClientSession | null = null;

  try {
    //verify user is authenticated
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    //validate payload
    const validatedPayload = projectFormSchema.safeParse(payload);
    if (!validatedPayload.success) {
      console.error('Validation error:', validatedPayload.error);
      return {
        success: false,
        message: 'Invalid payload',
        errors: validatedPayload.error.flatten().fieldErrors,
      };
    }

    const {
      title,
      description,
      techStack,
      githubLink,
      projectUrl,
      facultyId,
      teamMemberIds,
      phases,
    } = validatedPayload.data;

    await connectDb();

    //start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const techStackArray = techStack
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    //create phases
    const createdPhaseIds: mongoose.Types.ObjectId[] = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const createdTaskIds: mongoose.Types.ObjectId[] = [];

      //create tasks
      if (phase.tasks && phase.tasks.length > 0) {
        for (const taskData of phase.tasks) {
          const task = new Task({
            task: taskData.task,
            assignedTo: taskData.assignedTo || [],
            priority: taskData.priority,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
            createdBy: authSession.user.id,
            completed: false,
          });
          await task.save({ session });
          createdTaskIds.push(task._id);
        }
      }

      // Create phase
      const newPhase = new Phase({
        title: phase.title,
        deadline: new Date(phase.deadline),
        completed: false,
        order: i,
        tasks: createdTaskIds,
      });
      await newPhase.save({ session });
      createdPhaseIds.push(newPhase._id);
    }

    //create project
    const newProject = new Project({
      title,
      description,
      githubLink: githubLink || undefined,
      projectUrl: projectUrl || undefined,
      techStack: techStackArray,
      isPublic: true,
      teamMember: teamMemberIds,
      faculty: facultyId,
      phases: createdPhaseIds,
      currentPhase: 0,
      createdBy: authSession.user.id,
    });

    await newProject.save({ session });

    //commit transaction
    await session.commitTransaction();

    return {
      success: true,
      message: 'Project created successfully',
      projectId: newProject._id.toString(),
    };
  } catch (error) {
    // Rollback transaction on error
    if (session) {
      await session.abortTransaction();
    }
    console.error('Error creating project:', error);

    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      return {
        success: false,
        message: 'Validation error: ' + error.message,
      };
    }

    if ((error as any).code === 11000) {
      // Duplicate key error
      return {
        success: false,
        message: 'A project with this GitHub link or URL already exists',
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Error creating project',
    };
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
