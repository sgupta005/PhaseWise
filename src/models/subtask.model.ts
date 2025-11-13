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
