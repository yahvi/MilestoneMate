import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      required: true,
      index: true,
    },
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    provider: {
      type: String,
      default: 'paypal',
    },
    paypalOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paypalCaptureId: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'Awaiting Approval', 'Payment Initiated', 'Paid', 'Failed', 'Cancelled'],
      default: 'Payment Initiated',
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    capturedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
