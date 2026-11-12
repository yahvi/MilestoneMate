import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'info',
        'project_invite',
        'plan_approval',
        'plan_rejection',
        'submission',
        'revision_request',
        'milestone_approval',
        'payment_success',
        'payment_failed',
        'deadline_warning',
        'overdue',
      ],
      default: 'info',
    },
    relatedProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    relatedMilestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
