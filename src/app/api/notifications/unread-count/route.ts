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

    const count = await Notification.countDocuments({ userId, read: false });
    console.log('Unread count:', count);

    return NextResponse.json(
      {
        success: true,
        message: 'Unread count fetched successfully',
        data: { count },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch count' },
      { status: 500 }
    );
  }
}
