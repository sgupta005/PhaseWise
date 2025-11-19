import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import User from '@/models/user.model';
import Subtask from './subtask.model';
import Comment from './comment.model';

const taskSchema = new Schema(
  {
    task: {
      type: String,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
        validate: {
          validator: async function (
            studentId: Types.ObjectId
          ): Promise<boolean> {
            const user = await User.findById(studentId);
            return Boolean(user && user.role === 'student');
          },
          message: 'Task can only be assigned to student',
        },
      },
    ],
    priority: {
      type: String,
      enum: ['Low Priority', 'High Priority', 'Medium Priority', 'Urgent'],
      default: 'Low Priority',
    },
    status: {
      type: String,
      required: true,
      default: 'todo',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: Subtask,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: Comment,
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

type inferredTaskSchema = InferSchemaType<typeof taskSchema>;
export type TaskDocument = inferredTaskSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
