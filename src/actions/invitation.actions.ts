'use server';

import { auth } from '@/auth';
import {
  acceptInvitation,
  declineInvitation,
} from '@/lib/invitations/invitation.service';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function acceptInvitationAction(
  invitationId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    const result = await acceptInvitation(invitationId, session.user.id);

    if (result.success) {
      revalidatePath('/projects');
      revalidatePath('/');
    }

    return result;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to accept invitation',
    };
  }
}

export async function declineInvitationAction(
  invitationId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    const result = await declineInvitation(invitationId, session.user.id);

    return result;
  } catch (error) {
    console.error('Error declining invitation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to decline invitation',
    };
  }
}

