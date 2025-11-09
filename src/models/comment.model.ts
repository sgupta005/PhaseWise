import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import User from '@/models/user.model';

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

type inferredCommentSchema = InferSchemaType<typeof commentSchema>;
export type CommentDocument = inferredCommentSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
