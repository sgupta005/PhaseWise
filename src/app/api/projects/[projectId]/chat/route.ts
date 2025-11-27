import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import ChatMessage from '@/models/chat-message.model';
import { verifyProjectAccess } from '@/db/project.db';
import { ChatMessageResponse } from '@/types/chat.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Please log in',
          data: null,
        },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    await connectDb();

    // Verify user has access to this project
    const hasAccess = await verifyProjectAccess(projectId);
    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: You do not have access to this project',
          data: null,
        },
        { status: 403 }
      );
    }

    // Get optional cursor for pagination (timestamp of last message)
    const searchParams = request.nextUrl.searchParams;
    const after = searchParams.get('after');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Build query
    const query: { project: string; createdAt?: { $gt: Date } } = {
      project: projectId,
    };

    // If 'after' is provided, only fetch messages after that timestamp
    if (after) {
      query.createdAt = { $gt: new Date(after) };
    }

    /* 
      *Polling: get the messages oldest to newest 
      *Initial fetch: get the messages newest to oldest so we can get latest x(limit) message
       then reverse them so we get latest x(limit) messages in oldest to newest order
    */
    const messages = await ChatMessage.find(query)
      .populate('sender', 'name email image')
      .sort({ createdAt: after ? 1 : -1 })
      .limit(limit)
      .lean();
    const sortedMessages = after ? messages : messages.reverse();

    return NextResponse.json(
      {
        success: true,
        message: 'Messages fetched successfully',
        data: JSON.parse(
          JSON.stringify(sortedMessages)
        ) as ChatMessageResponse[],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch messages',
        data: null,
      },
      { status: 500 }
    );
  }
}
