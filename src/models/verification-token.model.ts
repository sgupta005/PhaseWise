import mongoose, { Schema } from 'mongoose';

const verificationTokenSchema = new Schema({
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
});

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model('VerificationToken', verificationTokenSchema);
export default VerificationToken;
