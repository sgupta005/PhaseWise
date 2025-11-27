import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import User from '@/models/user.model';
import Project from '@/models/project.model';

const chatMessageSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: Project,
      required: [true, 'Project reference is required'],
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, 'Sender is required'],
    },
  },
  { timestamps: true }
);

// Index for efficient querying of messages by project and time
chatMessageSchema.index({ project: 1, createdAt: -1 });

type InferredChatMessageSchema = InferSchemaType<typeof chatMessageSchema>;
export type ChatMessageDocument = InferredChatMessageSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
