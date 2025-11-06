import mongoose, { Schema, Types } from 'mongoose';
import User from '@/models/user.model';

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please enter title for project '],
  },
  description: {
    type: String,
  },
  githubLink: {
    type: String,
    unique: true,
    sparse: true,
  },
  projectUrl: {
    type: String,
    unique: true,
    sparse: true,
  },
  techStack: [
    {
      type: String,
      required: true,
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  teamMember: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please enter team member'],
      validate: {
        validator: async function (
          teamMemberId: Types.ObjectId
        ): Promise<boolean> {
          const user = await User.findById(teamMemberId);
          return user && user.role === 'student';
        },
        message: 'Selected user must have student role',
      },
    },
  ],
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter faculty'],
    validate: {
      validator: async function (facultyId: Types.ObjectId): Promise<boolean> {
        const user = await User.findById(facultyId);
        return user && user.role === 'faculty';
      },
      message: 'Selected user must have faculty role',
    },
  },
  phases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: [true, 'Please enter the phases'],
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter who is creating this project'],
  },
  taskStatuses: {
    type: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    default: [
      { id: 'todo', name: 'Todo', isDefault: true },
      { id: 'in-progress', name: 'In Progress', isDefault: false },
      { id: 'done', name: 'Done', isDefault: false },
    ],
    validate: {
      validator: function (
        statuses: { id: string; name: string; isDefault: boolean }[]
      ): boolean {
        // Ensure at least one status exists
        if (statuses.length === 0) return false;

        // Ensure exactly one status is marked as default
        const defaultCount = statuses.filter((s) => s.isDefault).length;
        return defaultCount === 1;
      },
      message:
        'Project must have at least one status and exactly one default status',
    },
  },
});

const Project =
  mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
