import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';

const verificationTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required for verification token'],
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
    },
    expires: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  { timestamps: true }
);

type inferredVerificationTokenSchema = InferSchemaType<
  typeof verificationTokenSchema
>;
export type VerificationTokenDocument = inferredVerificationTokenSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model('VerificationToken', verificationTokenSchema);
export default VerificationToken;
