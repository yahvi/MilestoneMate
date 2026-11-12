import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    category: {
      type: String,
      default: 'Web Development',
    },
    additionalRequirements: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Planning', 'Awaiting Client Approval', 'In Progress', 'Completed', 'On Hold', 'Rejected'],
      default: 'Draft',
    },
    clientApprovedPlan: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
projectSchema.index({ freelancerId: 1 });
projectSchema.index({ clientId: 1 });
projectSchema.index({ clientEmail: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
