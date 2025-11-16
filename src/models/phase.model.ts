import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import Task from './task.model';

const phaseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title of phase'],
    },
    deadline: {
      type: Date,
      required: [true, 'Set deadline for phase'],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: Task,
        required: [true, 'Please add some task in your phase'],
      },
    ],
  },
  { timestamps: true }
);

type inferredPhaseSchema = InferSchemaType<typeof phaseSchema>;
export type PhaseDocument = inferredPhaseSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Phase = mongoose.models.Phase || mongoose.model('Phase', phaseSchema);
export default Phase;
