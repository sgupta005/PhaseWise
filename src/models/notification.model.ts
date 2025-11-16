import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';

const notificationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  triggeredBy: { type: String, required: true, index: true }, // NEW FIELD
  type: {
    type: String,
    required: true,
    enum: [
      'TASK_ASSIGNED',
      'TASK_COMPLETED',
      'TASK_UPDATED',
      'PROJECT_INVITE',
      'PROJECT_ADDED',
    ],
  },
  link: { type: String, required: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

type inferredNotificationSchema = InferSchemaType<typeof notificationSchema>;
export type NotificationDocument = inferredNotificationSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);
export default Notification;
