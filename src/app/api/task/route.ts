import { getTaskById } from '@/db/task.db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  if (!taskId) {
    return NextResponse.json(
      { success: false, message: 'Task ID is required' },
      { status: 400 }
    );
  }
  const task = await getTaskById(taskId);
  if (!task) {
    return NextResponse.json(
      { success: false, message: 'Task not found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: task });
}
