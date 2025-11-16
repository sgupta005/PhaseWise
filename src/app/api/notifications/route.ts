import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Notification from '@/models/notification.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    await connectDb();

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Notifications fetched successfully',
        data: notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
