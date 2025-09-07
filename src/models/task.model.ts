import mongoose, { Schema, Types } from "mongoose";
import User from "@/models/user.model"

const taskSchema = new Schema({
    task: {
        type: String,
    },
    assignedTo: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            validate: {
                validator: async function (
                    studentId: Types.ObjectId
                ): Promise<boolean> {
                    const user = await User.findById(studentId);
                    return user && user.role === "student";
                },
                message:"Task can only be assigned to student"
            },
        },
    ],
    priority: {
        type: String,
            enum: ["Low Priority", "High Priority", "Medium Priority", "Urgent"],
            default: "Low Priority",
    }
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema)
export default Task
