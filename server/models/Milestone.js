import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
});

const deliverableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    tasks: [taskSchema],
    budget: {
      type: Number,
      required: [true, 'Milestone budget is required'],
      min: 0,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Awaiting Client Approval',
        'Pending',
        'In Progress',
        'Submitted for Review',
        'Revision Requested',
        'Approved',
        'Paid',
      ],
      default: 'Pending',
    },
    completionCriteria: {
      type: String,
      default: '',
    },
    deliverables: [deliverableSchema],
    submissionNotes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
    },
    clientFeedback: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ['Not Started', 'Awaiting Approval', 'Payment Initiated', 'Paid', 'Failed', 'Cancelled'],
      default: 'Not Started',
    },
    paypalOrderId: {
      type: String,
      default: null,
      index: true,
    },
    paypalCaptureId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.index({ projectId: 1, orderIndex: 1 });

const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
