import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
    },
    phoneNo: {
      type: Number,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

type inferredUserSchema = InferSchemaType<typeof userSchema>;
export type UserDocument = inferredUserSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
