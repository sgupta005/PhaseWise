import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import User from '@/models/user.model';

const subtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

type inferredSubtaskSchema = InferSchemaType<typeof subtaskSchema>;
export type SubtaskDocument = inferredSubtaskSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Subtask =
  mongoose.models.Subtask || mongoose.model('Subtask', subtaskSchema);
export default Subtask;
