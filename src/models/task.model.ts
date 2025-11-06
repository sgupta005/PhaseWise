import mongoose, { Schema, Types } from 'mongoose';
import User from '@/models/user.model';

const taskSchema = new Schema({
  task: {
    type: String,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function (
          studentId: Types.ObjectId
        ): Promise<boolean> {
          const user = await User.findById(studentId);
          return user && user.role === 'student';
        },
        message: 'Task can only be assigned to student',
      },
    },
  ],
  priority: {
    type: String,
    enum: ['Low Priority', 'High Priority', 'Medium Priority', 'Urgent'],
    default: 'Low Priority',
  },
  status: {
    type: String,
    required: true,
    default: 'todo',
  },
});

// Clear any existing model to prevent caching issues
if (mongoose.models.Task) {
  delete mongoose.models.Task;
}

const Task = mongoose.model('Task', taskSchema);
export default Task;
