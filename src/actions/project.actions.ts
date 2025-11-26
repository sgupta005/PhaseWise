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
import User from '@/models/user.model';
import Notification from '@/models/notification.model';
import ProjectInvitation from '@/models/project-invitation.model';
import mongoose from 'mongoose';
import { sendProjectInvitationEmail } from '@/lib/emails/projectInvitationMail';
import { sendProjectAddedEmail } from '@/lib/emails/projectAddedMail';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function createProjectAction(payload: ProjectFormAllFields) {
  // Start a session for transaction support
  let session: mongoose.ClientSession | null = null;

  try {
    //verify user is authenticated
    const authSession = await auth();
    if (!authSession?.user?.id || !authSession?.user?.role) {
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
      facultyIds,
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

    // Get creator info
    const creator = await User.findById(authSession.user.id);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const creatorRole = authSession.user.role;
    const creatorId = authSession.user.id;

    // Determine which members get added directly vs need invitations
    // Faculty creator: can add students directly, faculty need invitations
    // Student creator: everyone needs invitations
    const directAddStudentIds: string[] = [];
    const directAddFacultyIds: string[] = [];
    const inviteStudentIds: string[] = [];
    const inviteFacultyIds: string[] = [];

    if (creatorRole === 'faculty') {
      // Faculty can add students directly
      directAddStudentIds.push(
        ...teamMemberIds.filter((id) => id !== creatorId)
      );
      // Faculty members other than self need invitations
      inviteFacultyIds.push(...facultyIds.filter((id) => id !== creatorId));
      // Add self to faculty if faculty is creator
      if (!facultyIds.includes(creatorId)) {
        directAddFacultyIds.push(creatorId);
      } else {
        directAddFacultyIds.push(creatorId);
      }
    } else {
      // Student creator - everyone needs invitations except self
      inviteStudentIds.push(...teamMemberIds.filter((id) => id !== creatorId));
      inviteFacultyIds.push(...facultyIds);
      // Add self to team members if student is creator
      if (!teamMemberIds.includes(creatorId)) {
        directAddStudentIds.push(creatorId);
      } else {
        directAddStudentIds.push(creatorId);
      }
    }

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

    //create project with only directly added members
    const newProject = new Project({
      title,
      description,
      githubLink: githubLink || undefined,
      projectUrl: projectUrl || undefined,
      techStack: techStackArray,
      isPublic: true,
      teamMember: directAddStudentIds,
      faculty: directAddFacultyIds,
      phases: createdPhaseIds,
      currentPhase: 0,
      createdBy: authSession.user.id,
    });

    await newProject.save({ session });

    //commit transaction
    await session.commitTransaction();

    const projectId = newProject._id.toString();
    /* *this is the link that will be sent in notification
     *projectUrl is the deployed link of project added by the user
     */
    const projectUrl2 = `${baseUrl}/projects/${projectId}`;

    // Send notifications/invitations for directly added members (non-blocking)
    const notificationPromises: Promise<any>[] = [];

    // Notify directly added students (except creator)
    for (const studentId of directAddStudentIds) {
      if (studentId === creatorId) continue;

      const student = await User.findById(studentId);
      if (!student) continue;

      notificationPromises.push(
        Notification.create({
          triggeredBy: creatorId,
          userId: studentId,
          type: 'PROJECT_ADDED',
          link: projectUrl2,
          title: 'Added to Project',
          message: `${creator.name} added you to "${title}" as a Team Member`,
          metadata: { projectId, addedBy: creatorId, role: 'student' },
        })
      );

      sendProjectAddedEmail({
        to: student.email,
        userName: student.name,
        addedByName: creator.name,
        projectName: title,
        role: 'student',
        projectUrl: projectUrl2,
      }).catch(console.error);
    }

    // Send invitations to students who need them
    for (const studentId of inviteStudentIds) {
      const student = await User.findById(studentId);
      if (!student) continue;

      const invitation = await ProjectInvitation.create({
        projectId,
        invitedUserId: studentId,
        invitedBy: creatorId,
        role: 'student',
        status: 'pending',
      });

      notificationPromises.push(
        Notification.create({
          triggeredBy: creatorId,
          userId: studentId,
          type: 'PROJECT_INVITE',
          link: projectUrl2,
          title: 'Project Invitation',
          message: `${creator.name} invited you to join "${title}" as a Team Member`,
          metadata: {
            projectId,
            invitationId: invitation._id.toString(),
            invitedBy: creatorId,
            role: 'student',
          },
        })
      );

      sendProjectInvitationEmail({
        to: student.email,
        inviteeName: student.name,
        inviterName: creator.name,
        projectName: title,
        role: 'student',
        projectUrl: projectUrl2,
      }).catch(console.error);
    }

    // Send invitations to faculty
    for (const facultyId of inviteFacultyIds) {
      const faculty = await User.findById(facultyId);
      if (!faculty) continue;

      const invitation = await ProjectInvitation.create({
        projectId,
        invitedUserId: facultyId,
        invitedBy: creatorId,
        role: 'faculty',
        status: 'pending',
      });

      notificationPromises.push(
        Notification.create({
          triggeredBy: creatorId,
          userId: facultyId,
          type: 'PROJECT_INVITE',
          link: projectUrl2,
          title: 'Project Invitation',
          message: `${creator.name} invited you to join "${title}" as a Faculty Mentor`,
          metadata: {
            projectId,
            invitationId: invitation._id.toString(),
            invitedBy: creatorId,
            role: 'faculty',
          },
        })
      );

      sendProjectInvitationEmail({
        to: faculty.email,
        inviteeName: faculty.name,
        inviterName: creator.name,
        projectName: title,
        role: 'faculty',
        projectUrl: projectUrl2,
      }).catch(console.error);
    }

    // Wait for notifications but don't block on email
    await Promise.all(notificationPromises);

    return {
      success: true,
      message: 'Project created successfully',
      projectId,
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
