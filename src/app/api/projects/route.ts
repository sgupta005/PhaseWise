import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Project from "@/models/project.model";
import Phase from "@/models/phase.model";
import Task from "@/models/task.model";
import User from "@/models/user.model";
import mongoose from "mongoose";

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

        // ✅ 1. Basic field validations
        if (
            !title ||
            !githubLink ||
            !techStack?.length ||
            !teamMember?.length ||
            !faculty ||
            !createdBy ||
            !phases?.length
        ) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // ✅ 2. Check for duplicate GitHub link
        const existingProject = await Project.findOne({ githubLink });
        if (existingProject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project with this GitHub link already exists",
                },
                { status: 400 }
            );
        }

        // ✅ 3. Validate faculty
        const facultyUser = await User.findById(faculty);
        if (!facultyUser || facultyUser.role !== "faculty") {
            return NextResponse.json(
                { success: false, message: "Invalid faculty user or role" },
                { status: 400 }
            );
        }

        // ✅ 4. Validate team members
        const teamUsers = await User.find({ _id: { $in: teamMember } });
        if (teamUsers.length !== teamMember.length) {
            return NextResponse.json(
                { success: false, message: "Some team members not found" },
                { status: 400 }
            );
        }

        const invalidMembers = teamUsers.filter(
            (user) => user.role !== "student"
        );
        if (invalidMembers.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All team members must have 'student' role",
                },
                { status: 400 }
            );
        }

        // ✅ 5. Validate phases and tasks
        for (const phase of phases) {
            if (!phase.title || !phase.tasks?.length) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Each phase must have a title and at least one task",
                    },
                    { status: 400 }
                );
            }
        }

        // ✅ 6. Begin saving (Phases + Tasks + Project)
        const phaseIds: string[] = [];

        for (const phase of phases) {
            const savedTasks = await Task.insertMany(phase.tasks);
            const taskIds = savedTasks.map((task) => task._id);

            const newPhase = await Phase.create({
                title: phase.title,
                deadline: phase.deadline, // ✅ now included
                currentPhase: phase.currentPhase || 1,
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
                message: "Project created successfully",
                project: newProject,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        let message = "Error in creating projects";

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

export async function GET(request: Request) {
    await connectDb();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Check if id exists
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project ID is required",
                    data: null,
                },
                { status: 400 }
            );
        }

        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id) || String(new ObjectId(id)) !== id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Project ID format",
                    data: null,
                },
                { status: 400 }
            );
        }

        // Find project by ID
        const project = await Project.findById(id).populate({
            path: "phases",
            populate: {
                path: "tasks",
            },
        });

        // Check if project exists
        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project not found",
                    data: null,
                },
                { status: 404 }
            );
        }

        // Return the project
        return NextResponse.json(
            {
                success: true,
                message: "Project retrieved successfully",
                data: project,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        let message = "Error in getting Project";

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
