import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';
import User from '@/models/user.model';
import Project from '@/models/project.model';

const projectInvitationSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: Project,
      required: [true, 'Project ID is required'],
      index: true,
    },
    invitedUserId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, 'Invited user ID is required'],
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, 'Inviter ID is required'],
    },
    role: {
      type: String,
      enum: ['faculty', 'student'],
      required: [true, 'Role is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
projectInvitationSchema.index({ projectId: 1, invitedUserId: 1, status: 1 });

// Check for existing pending invitation before creating
projectInvitationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingInvitation = await ProjectInvitation.findOne({
      projectId: this.projectId,
      invitedUserId: this.invitedUserId,
      status: 'pending',
    });

    if (existingInvitation) {
      const error = new Error(
        'A pending invitation already exists for this user'
      );
      return next(error);
    }
  }
  next();
});

type inferredProjectInvitationSchema = InferSchemaType<
  typeof projectInvitationSchema
>;
export type ProjectInvitationDocument = inferredProjectInvitationSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const ProjectInvitation =
  mongoose.models.ProjectInvitation ||
  mongoose.model('ProjectInvitation', projectInvitationSchema);

export default ProjectInvitation;
