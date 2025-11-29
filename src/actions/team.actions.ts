'use server';

import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import User from '@/models/user.model';
import { addMemberToProject } from '@/lib/invitations/invitation.service';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { sendProjectRemovedNotification } from '@/lib/notifications/notification.service';

interface ActionResult {
  success: boolean;
  message: string;
  directlyAdded?: boolean;
}

/**
 * Add a team member to a project
 * - Faculty adding students: direct add
 * - Students adding anyone: send invitation
 */
export async function addTeamMemberAction(
  projectId: string,
  userId: string,
  role: 'faculty' | 'student'
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    await connectDb();

    // Verify the current user has permission to add members
    const project = await Project.findById(projectId);
    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    const isCreator = project.createdBy.toString() === session.user.id;
    const isFaculty = project.faculty.some(
      (id: mongoose.Types.ObjectId) => id.toString() === session.user.id
    );

    if (!isCreator && !isFaculty) {
      return {
        success: false,
        message: 'Only the project creator or faculty can add members',
      };
    }

    const result = await addMemberToProject({
      projectId,
      invitedUserId: userId,
      invitedByUserId: session.user.id,
      role,
    });

    if (result.success) {
      revalidatePath(`/projects/${projectId}`);
      revalidatePath(`/projects/${projectId}/team`);
    }

    return result;
  } catch (error) {
    console.error('Error adding team member:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to add team member',
    };
  }
}

/**
 * Remove a team member from a project
 * Faculty can only be removed by another faculty or they can leave the project
 * Students can only be removed by the project creator
 */
export async function removeTeamMemberAction(
  projectId: string,
  userId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    await connectDb();

    const project = await Project.findById(projectId);
    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    const isCreator = project.createdBy.toString() === session.user.id;
    const isFaculty = project.faculty.some(
      (id: mongoose.Types.ObjectId) => id.toString() === session.user.id
    );

    if (!isCreator && !isFaculty) {
      return {
        success: false,
        message: 'Only the project creator or faculty can remove members',
      };
    }

    // Cannot remove yourself using this action (use leaveProject instead)
    if (userId === session.user.id) {
      return {
        success: false,
        message: 'Use the leave project option to remove yourself',
      };
    }

    // Get the user to remove to determine their role
    const userToRemove = await User.findById(userId);
    if (!userToRemove) {
      return { success: false, message: 'User not found' };
    }

    if (userToRemove.role === 'faculty' && !isFaculty) {
      return {
        success: false,
        message: 'Only faculty can remove other faculty members',
      };
    }

    // Remove from appropriate array based on role
    if (userToRemove.role === 'student') {
      const memberIndex = project.teamMember.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === userId
      );
      if (memberIndex === -1) {
        return { success: false, message: 'User is not a team member' };
      }
      project.teamMember.splice(memberIndex, 1);
    } else if (userToRemove.role === 'faculty') {
      const facultyIndex = project.faculty.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === userId
      );
      if (facultyIndex === -1) {
        return { success: false, message: 'User is not a faculty member' };
      }
      project.faculty.splice(facultyIndex, 1);
    }

    await project.save();

    await sendProjectRemovedNotification({
      projectId,
      projectName: project.title,
      userId: userToRemove._id.toString(),
      removedById: session.user.id,
      removedByName: session.user.name || '',
      removedByrole: session.user.role as 'faculty' | 'student',
    });

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/team`);

    return {
      success: true,
      message: `${userToRemove.name} has been removed from the project`,
    };
  } catch (error) {
    console.error('Error removing team member:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to remove team member',
    };
  }
}

/**
 * Leave a project
 * Any team member can leave the project
 */
export async function leaveProjectAction(
  projectId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    await connectDb();

    const project = await Project.findById(projectId);
    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Find and remove user from appropriate array
    let removed = false;

    if (userRole === 'student') {
      const memberIndex = project.teamMember.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === userId
      );
      if (memberIndex !== -1) {
        project.teamMember.splice(memberIndex, 1);
        removed = true;
      }
    } else if (userRole === 'faculty') {
      const facultyIndex = project.faculty.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === userId
      );
      if (facultyIndex !== -1) {
        project.faculty.splice(facultyIndex, 1);
        removed = true;
      }
    }

    if (!removed) {
      return {
        success: false,
        message: 'You are not a member of this project',
      };
    }

    await project.save();

    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/team`);

    return {
      success: true,
      message: 'You have left the project',
    };
  } catch (error) {
    console.error('Error leaving project:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to leave project',
    };
  }
}
