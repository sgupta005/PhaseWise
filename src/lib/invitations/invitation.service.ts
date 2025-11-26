import { connectDb } from '@/dbConfig/dbConfig';
import ProjectInvitation, {
  ProjectInvitationDocument,
} from '@/models/project-invitation.model';
import Notification, {
  NotificationDocument,
} from '@/models/notification.model';
import Project from '@/models/project.model';
import User from '@/models/user.model';
import { sendProjectInvitationEmail } from '@/lib/emails/projectInvitationMail';
import { sendProjectAddedEmail } from '@/lib/emails/projectAddedMail';
import mongoose from 'mongoose';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface AddMemberParams {
  projectId: string;
  invitedUserId: string;
  invitedByUserId: string;
  role: 'faculty' | 'student';
}

export interface InvitationResult {
  success: boolean;
  message: string;
  invitationId?: string;
  directlyAdded?: boolean;
}

/**
 * Determines whether to send an invitation or directly add a member based on:
 * - If inviter is faculty -> direct add (students only)
 * - If inviter is student -> send invitation requiring confirmation
 */
export async function addMemberToProject(
  params: AddMemberParams
): Promise<InvitationResult> {
  const { projectId, invitedUserId, invitedByUserId, role } = params;

  await connectDb();

  // Get the inviter to check their role
  const inviter = await User.findById(invitedByUserId);
  if (!inviter) {
    return { success: false, message: 'Inviter not found' };
  }

  // Get the invited user
  const invitedUser = await User.findById(invitedUserId);
  if (!invitedUser) {
    return { success: false, message: 'Invited user not found' };
  }

  // Validate that invited user's actual role matches the role they're being invited as
  if (invitedUser.role !== role) {
    return {
      success: false,
      message: `User is a ${invitedUser.role}, not a ${role}`,
    };
  }

  // Get the project
  const project = await Project.findById(projectId);
  if (!project) {
    return { success: false, message: 'Project not found' };
  }

  // Check if user is already a member
  const isAlreadyMember =
    (role === 'student' &&
      project.teamMember.some(
        (id: mongoose.Types.ObjectId) => id.toString() === invitedUserId
      )) ||
    (role === 'faculty' &&
      project.faculty.some(
        (id: mongoose.Types.ObjectId) => id.toString() === invitedUserId
      ));

  if (isAlreadyMember) {
    return {
      success: false,
      message: 'User is already a member of this project',
    };
  }

  // Check for existing pending invitation
  const existingInvitation = await ProjectInvitation.findOne({
    projectId,
    invitedUserId,
    status: 'pending',
  });

  if (existingInvitation) {
    return {
      success: false,
      message: 'An invitation is already pending for this user',
    };
  }

  const projectUrl = `${baseUrl}/projects/${projectId}`;

  // Faculty adding students -> direct add
  if (inviter.role === 'faculty' && role === 'student') {
    return await directlyAddMember({
      project,
      invitedUser,
      inviter,
      role,
      projectUrl,
    });
  }

  // All other cases -> send invitation
  return await sendInvitation({
    projectId,
    invitedUser,
    inviter,
    role,
    projectUrl,
    projectName: project.title,
  });
}

interface DirectAddParams {
  project: any;
  invitedUser: any;
  inviter: any;
  role: 'faculty' | 'student';
  projectUrl: string;
}

async function directlyAddMember(
  params: DirectAddParams
): Promise<InvitationResult> {
  const { project, invitedUser, inviter, role, projectUrl } = params;

  try {
    // Add user to the project
    if (role === 'student') {
      project.teamMember.push(invitedUser._id);
    } else {
      project.faculty.push(invitedUser._id);
    }
    await project.save();

    // Create in-app notification
    await Notification.create<NotificationDocument>({
      triggeredBy: inviter._id.toString(),
      userId: invitedUser._id.toString(),
      type: 'PROJECT_ADDED',
      link: projectUrl,
      title: 'Added to Project',
      message: `${inviter.name} added you to "${project.title}" as a ${role === 'faculty' ? 'Faculty Mentor' : 'Team Member'}`,
      metadata: {
        projectId: project._id.toString(),
        addedBy: inviter._id.toString(),
        role,
      },
    });

    // Send email notification (non-blocking)
    sendProjectAddedEmail({
      to: invitedUser.email,
      userName: invitedUser.name,
      addedByName: inviter.name,
      projectName: project.title,
      role,
      projectUrl,
    }).catch((error) => {
      console.error('Failed to send project added email:', error);
    });

    return {
      success: true,
      message: `${invitedUser.name} has been added to the project`,
      directlyAdded: true,
    };
  } catch (error) {
    console.error('Error directly adding member:', error);
    return { success: false, message: 'Failed to add member to project' };
  }
}

interface SendInvitationParams {
  projectId: string;
  invitedUser: any;
  inviter: any;
  role: 'faculty' | 'student';
  projectUrl: string;
  projectName: string;
}

async function sendInvitation(
  params: SendInvitationParams
): Promise<InvitationResult> {
  const { projectId, invitedUser, inviter, role, projectUrl, projectName } =
    params;

  try {
    // Create invitation record
    const invitation = await ProjectInvitation.create({
      projectId,
      invitedUserId: invitedUser._id,
      invitedBy: inviter._id,
      role,
      status: 'pending',
    });

    // Create in-app notification with invitation ID in metadata
    await Notification.create<NotificationDocument>({
      triggeredBy: inviter._id.toString(),
      userId: invitedUser._id.toString(),
      type: 'PROJECT_INVITE',
      link: projectUrl,
      title: 'Project Invitation',
      message: `${inviter.name} invited you to join "${projectName}" as a ${role === 'faculty' ? 'Faculty Mentor' : 'Team Member'}`,
      metadata: {
        projectId,
        invitationId: invitation._id.toString(),
        invitedBy: inviter._id.toString(),
        role,
      },
    });

    // Send email notification (non-blocking)
    sendProjectInvitationEmail({
      to: invitedUser.email,
      inviteeName: invitedUser.name,
      inviterName: inviter.name,
      projectName,
      role,
      projectUrl,
    }).catch((error) => {
      console.error('Failed to send project invitation email:', error);
    });

    return {
      success: true,
      message: `Invitation sent to ${invitedUser.name}`,
      invitationId: invitation._id.toString(),
      directlyAdded: false,
    };
  } catch (error) {
    console.error('Error sending invitation:', error);
    if (
      error instanceof Error &&
      error.message.includes('pending invitation')
    ) {
      return {
        success: false,
        message: 'An invitation is already pending for this user',
      };
    }
    return { success: false, message: 'Failed to send invitation' };
  }
}

/**
 * Accept a project invitation
 */
export async function acceptInvitation(
  invitationId: string,
  userId: string
): Promise<InvitationResult> {
  await connectDb();

  const invitation = await ProjectInvitation.findById(invitationId);
  if (!invitation) {
    return { success: false, message: 'Invitation not found' };
  }

  if (invitation.invitedUserId.toString() !== userId) {
    return { success: false, message: 'This invitation is not for you' };
  }

  if (invitation.status !== 'pending') {
    return {
      success: false,
      message: `Invitation has already been ${invitation.status}`,
    };
  }

  if (new Date() > invitation.expiresAt) {
    invitation.status = 'expired';
    await invitation.save();
    return { success: false, message: 'Invitation has expired' };
  }

  const project = await Project.findById(invitation.projectId);
  if (!project) {
    return { success: false, message: 'Project not found' };
  }

  try {
    // Add user to the project
    if (invitation.role === 'student') {
      project.teamMember.push(invitation.invitedUserId);
    } else {
      project.faculty.push(invitation.invitedUserId);
    }
    await project.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    // Mark the notification as read
    await Notification.updateMany(
      {
        userId,
        'metadata.invitationId': invitationId,
      },
      { read: true }
    );

    return {
      success: true,
      message: `You have joined "${project.title}"`,
    };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return { success: false, message: 'Failed to accept invitation' };
  }
}

/**
 * Decline a project invitation
 */
export async function declineInvitation(
  invitationId: string,
  userId: string
): Promise<InvitationResult> {
  await connectDb();

  const invitation = await ProjectInvitation.findById(invitationId);
  if (!invitation) {
    return { success: false, message: 'Invitation not found' };
  }

  if (invitation.invitedUserId.toString() !== userId) {
    return { success: false, message: 'This invitation is not for you' };
  }

  if (invitation.status !== 'pending') {
    return {
      success: false,
      message: `Invitation has already been ${invitation.status}`,
    };
  }

  try {
    invitation.status = 'declined';
    await invitation.save();

    // Mark the notification as read
    await Notification.updateMany(
      {
        userId,
        'metadata.invitationId': invitationId,
      },
      { read: true }
    );

    return {
      success: true,
      message: 'Invitation declined',
    };
  } catch (error) {
    console.error('Error declining invitation:', error);
    return { success: false, message: 'Failed to decline invitation' };
  }
}

/**
 * Get pending invitations for a user
 */
export async function getPendingInvitations(
  userId: string
): Promise<ProjectInvitationDocument[]> {
  await connectDb();

  const invitations = await ProjectInvitation.find({
    invitedUserId: userId,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
    .populate('projectId', 'title')
    .populate('invitedBy', 'name email')
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(invitations));
}
