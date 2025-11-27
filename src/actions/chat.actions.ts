'use server';

import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import ChatMessage from '@/models/chat-message.model';
import { verifyProjectAccess } from '@/db/project.db';

interface ChatActionResponse {
  success: boolean;
  message: string;
}

export async function sendMessageAction(
  projectId: string,
  content: string
): Promise<ChatActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate message content
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        message: 'Message cannot be empty',
      };
    }

    if (content.trim().length > 2000) {
      return {
        success: false,
        message: 'Message is too long (max 2000 characters)',
      };
    }

    await connectDb();

    // Verify user has access to this project (is team member or faculty)
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Unauthorized: You do not have access to this project',
      };
    }

    // Create the message
    await ChatMessage.create({
      content: content.trim(),
      project: projectId,
      sender: session.user.id,
    });

    return {
      success: true,
      message: 'Message sent successfully',
    };
  } catch (error) {
    console.error('Error in sendMessageAction:', error);
    return {
      success: false,
      message: 'Failed to send message',
    };
  }
}
