import { NextResponse } from 'next/server';
import { getUserProjectsWithTeamAndFaculty } from '@/db/project.db';

export async function GET() {
  try {
    const projects = await getUserProjectsWithTeamAndFaculty();
    return NextResponse.json(
      {
        success: true,
        message: 'Projects fetched successfully',
        data: projects,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    let message = 'Error in fetching projects';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      { status: 500 }
    );
  }
}
