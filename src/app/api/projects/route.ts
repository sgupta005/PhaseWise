import { NextResponse } from 'next/server';
import { connectDb } from '@/dbConfig/dbConfig';
import Project from '@/models/project.model';
import Phase from '@/models/phase.model';
import Task from '@/models/task.model';
import User from '@/models/user.model';
import { getUserProjectsWithTeamAndFaculty } from '@/db/project.db';

export async function GET(request: Request) {
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

export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      title,
      description,
      githubLink,
      projectUrl,
      techStack,
      isPublic,
      teamMember,
      faculty,
      createdBy,
      phases,
    } = body;

    // Basic field validations
    if (
      !title ||
      // !githubLink ||
      !techStack?.length ||
      !teamMember?.length ||
      !faculty ||
      !createdBy ||
      !phases?.length
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate faculty
    const facultyUser = await User.findById(faculty);
    if (!facultyUser || facultyUser.role !== 'faculty') {
      return NextResponse.json(
        { success: false, message: 'Invalid faculty user or role' },
        { status: 400 }
      );
    }

    // Validate team members
    const teamUsers = await User.find({ _id: { $in: teamMember } });
    if (teamUsers.length !== teamMember.length) {
      return NextResponse.json(
        { success: false, message: 'Some team members not found' },
        { status: 400 }
      );
    }

    const invalidMembers = teamUsers.filter((user) => user.role !== 'student');
    if (invalidMembers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "All team members must have 'student' role",
        },
        { status: 400 }
      );
    }

    // Validate phases and tasks
    for (const phase of phases) {
      if (!phase.title || !phase.tasks?.length) {
        return NextResponse.json(
          {
            success: false,
            message: 'Each phase must have a title and at least one task',
          },
          { status: 400 }
        );
      }
    }

    // Begin saving (Phases + Tasks + Project)
    const phaseIds: string[] = [];

    for (const phase of phases) {
      const savedTasks = await Task.insertMany(phase.tasks);
      const taskIds = savedTasks.map((task) => task._id);

      const newPhase = await Phase.create({
        title: phase.title,
        deadline: phase.deadline,
        tasks: taskIds,
      });

      phaseIds.push(newPhase._id);
    }

    const newProject = await Project.create({
      title,
      description,
      githubLink,
      projectUrl,
      techStack,
      isPublic,
      teamMember,
      faculty,
      createdBy,
      phases: phaseIds,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    let message = 'Error in creating projects';

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
