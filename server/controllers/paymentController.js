import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';
import paypalService from '../services/paypalService.js';
import notificationService from '../services/notificationService.js';
import { mockDB } from '../utils/mockDB.js';

export const createOrder = async (req, res, next) => {
  try {
    const { milestoneId } = req.body;
    if (!milestoneId) return res.status(400).json({ success: false, message: 'Milestone ID is required.' });

    let milestone;
    let project;

    if (mongoose.connection.readyState === 1) {
      milestone = await Milestone.findById(milestoneId);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found.' });
      project = await Project.findById(milestone.projectId);
    } else {
      milestone = mockDB.milestones.find((m) => m._id.toString() === milestoneId.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found.' });
      project = mockDB.projects.find((p) => p._id.toString() === milestone.projectId.toString());
    }

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Server authoritative amount
    const verifiedAmount = Number(milestone.budget);
    const currency = project.currency || 'USD';

    // Call PayPal REST API to create order
    const order = await paypalService.createOrder({
      milestoneId: milestone._id,
      amount: verifiedAmount,
      currency,
      title: `${project.title}: ${milestone.title}`,
    });

    if (mongoose.connection.readyState === 1) {
      let payment = await Payment.findOne({ paypalOrderId: order.id });
      if (!payment) {
        payment = await Payment.create({
          projectId: project._id,
          milestoneId: milestone._id,
          payerId: req.user._id,
          payeeId: project.freelancerId,
          amount: verifiedAmount,
          currency,
          provider: 'paypal',
          paypalOrderId: order.id,
          status: 'Payment Initiated',
        });
      }
      milestone.paypalOrderId = order.id;
      milestone.paymentStatus = 'Payment Initiated';
      await milestone.save();
    } else {
      let payment = mockDB.payments.find((p) => p.paypalOrderId === order.id);
      if (!payment) {
        payment = {
          _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
          projectId: project._id.toString(),
          milestoneId: milestone._id.toString(),
          payerId: req.user._id.toString(),
          payeeId: project.freelancerId.toString(),
          amount: verifiedAmount,
          currency,
          provider: 'paypal',
          paypalOrderId: order.id,
          status: 'Payment Initiated',
          createdAt: new Date(),
        };
        mockDB.payments.push(payment);
      }
      milestone.paypalOrderId = order.id;
      milestone.paymentStatus = 'Payment Initiated';
    }

    res.json({
      success: true,
      orderId: order.id,
      simulated: order.simulated || false,
      amount: verifiedAmount,
      currency,
    });
  } catch (err) {
    next(err);
  }
};

export const captureOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'Order ID is required.' });

    let payment;
    let milestone;
    let project;

    if (mongoose.connection.readyState === 1) {
      payment = await Payment.findOne({ paypalOrderId: orderId });
      if (!payment) {
        milestone = await Milestone.findOne({ paypalOrderId: orderId });
        if (milestone) {
          project = await Project.findById(milestone.projectId);
          payment = await Payment.create({
            projectId: project._id,
            milestoneId: milestone._id,
            payerId: req.user._id,
            payeeId: project.freelancerId,
            amount: milestone.budget,
            currency: project.currency,
            provider: 'paypal',
            paypalOrderId: orderId,
            status: 'Payment Initiated',
          });
        } else {
          return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }
      }

      if (payment.status === 'Paid') {
        return res.json({ success: true, message: 'Already captured', payment });
      }

      const captureData = await paypalService.captureOrder(orderId);
      const captureId =
        captureData.id ||
        captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
        `CAP-${orderId}`;

      payment.status = 'Paid';
      payment.paypalCaptureId = captureId;
      payment.capturedAt = new Date();
      payment.paymentDetails = captureData;
      await payment.save();

      milestone = await Milestone.findById(payment.milestoneId);
      if (milestone) {
        milestone.status = 'Paid';
        milestone.paymentStatus = 'Paid';
        milestone.paidAt = new Date();
        milestone.paypalCaptureId = captureId;
        await milestone.save();
      }

      // Check if all milestones are paid
      const allMilestones = await Milestone.find({ projectId: payment.projectId });
      const allPaid = allMilestones.length > 0 && allMilestones.every((m) => m.status === 'Paid');
      if (allPaid) {
        await Project.findByIdAndUpdate(payment.projectId, { status: 'Completed' });
      }

      await notificationService.notify({
        userId: payment.payeeId,
        title: 'Payment Received! 💰',
        message: `You received a verified PayPal payment of $${payment.amount} ${payment.currency} for "${milestone?.title}".`,
        type: 'payment_success',
        projectId: payment.projectId,
        milestoneId: payment.milestoneId,
      });

      await notificationService.notify({
        userId: payment.payerId,
        title: 'Payment Sent Successfully',
        message: `Your payment of $${payment.amount} ${payment.currency} was verified.`,
        type: 'payment_success',
        projectId: payment.projectId,
        milestoneId: payment.milestoneId,
      });

      await notificationService.logActivity({
        projectId: payment.projectId,
        userId: req.user._id,
        action: 'Payment Captured',
        description: `PayPal payment of $${payment.amount} ${payment.currency} captured (Transaction ID: ${captureId}).`,
      });

      return res.json({ success: true, message: 'Payment captured and verified', payment, milestone });
    } else {
      // In-Memory Mode
      payment = mockDB.payments.find((p) => p.paypalOrderId === orderId);
      if (!payment) {
        milestone = mockDB.milestones.find((m) => m.paypalOrderId === orderId);
        if (milestone) {
          project = mockDB.projects.find((p) => p._id.toString() === milestone.projectId.toString());
          payment = {
            _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
            projectId: project._id.toString(),
            milestoneId: milestone._id.toString(),
            payerId: req.user._id.toString(),
            payeeId: project.freelancerId.toString(),
            amount: milestone.budget,
            currency: project.currency,
            provider: 'paypal',
            paypalOrderId: orderId,
            status: 'Payment Initiated',
            createdAt: new Date(),
          };
          mockDB.payments.push(payment);
        } else {
          return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }
      }

      if (payment.status === 'Paid') {
        return res.json({ success: true, message: 'Already captured', payment });
      }

      const captureData = await paypalService.captureOrder(orderId);
      const captureId =
        captureData.id || `CAP-${orderId}`;

      payment.status = 'Paid';
      payment.paypalCaptureId = captureId;
      payment.capturedAt = new Date();
      payment.paymentDetails = captureData;

      milestone = mockDB.milestones.find((m) => m._id.toString() === payment.milestoneId.toString());
      if (milestone) {
        milestone.status = 'Paid';
        milestone.paymentStatus = 'Paid';
        milestone.paidAt = new Date();
        milestone.paypalCaptureId = captureId;
      }

      const allMilestones = mockDB.milestones.filter(
        (m) => m.projectId.toString() === payment.projectId.toString()
      );
      const allPaid = allMilestones.length > 0 && allMilestones.every((m) => m.status === 'Paid');
      if (allPaid) {
        project = mockDB.projects.find((p) => p._id.toString() === payment.projectId.toString());
        if (project) project.status = 'Completed';
      }

      await notificationService.notify({
        userId: payment.payeeId,
        title: 'Payment Received! 💰',
        message: `You received a verified PayPal payment of $${payment.amount} ${payment.currency} for "${milestone?.title}".`,
        type: 'payment_success',
        projectId: payment.projectId,
        milestoneId: payment.milestoneId,
      });

      await notificationService.notify({
        userId: payment.payerId,
        title: 'Payment Sent Successfully',
        message: `Your payment of $${payment.amount} ${payment.currency} was verified.`,
        type: 'payment_success',
        projectId: payment.projectId,
        milestoneId: payment.milestoneId,
      });

      await notificationService.logActivity({
        projectId: payment.projectId,
        userId: req.user._id,
        action: 'Payment Captured',
        description: `PayPal payment of $${payment.amount} ${payment.currency} captured (Transaction ID: ${captureId}).`,
      });

      return res.json({ success: true, message: 'Payment captured and verified', payment, milestone });
    }
  } catch (err) {
    next(err);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (req.user.role === 'freelancer') {
        query = { payeeId: req.user._id };
      } else {
        query = { payerId: req.user._id };
      }

      const payments = await Payment.find(query)
        .populate('projectId', 'title clientEmail totalBudget currency')
        .populate('milestoneId', 'title description orderIndex')
        .populate('payerId', 'name email')
        .populate('payeeId', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: payments.length, payments });
    } else {
      const userIdStr = req.user._id.toString();
      const userPayments = mockDB.payments.filter((p) => {
        if (req.user.role === 'freelancer') {
          return p.payeeId?.toString() === userIdStr;
        } else {
          return p.payerId?.toString() === userIdStr;
        }
      });

      const enriched = userPayments.map((p) => {
        const proj = mockDB.projects.find((pr) => pr._id.toString() === p.projectId.toString());
        const mile = mockDB.milestones.find((m) => m._id.toString() === p.milestoneId.toString());
        const payer = mockDB.users.find((u) => u._id.toString() === p.payerId.toString());
        const payee = mockDB.users.find((u) => u._id.toString() === p.payeeId.toString());
        return {
          ...p,
          projectId: proj ? { title: proj.title, clientEmail: proj.clientEmail, totalBudget: proj.totalBudget, currency: proj.currency } : null,
          milestoneId: mile ? { title: mile.title, description: mile.description, orderIndex: mile.orderIndex } : null,
          payerId: payer ? { name: payer.name, email: payer.email } : null,
          payeeId: payee ? { name: payee.name, email: payee.email } : null,
        };
      });

      return res.json({ success: true, count: enriched.length, payments: enriched });
    }
  } catch (err) {
    next(err);
  }
};

export const getProjectPayments = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const payments = await Payment.find({ projectId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: payments.length, payments });
    } else {
      const payments = mockDB.payments.filter((p) => p.projectId.toString() === projectId.toString());
      return res.json({ success: true, count: payments.length, payments });
    }
  } catch (err) {
    next(err);
  }
};

export const handleWebhook = async (req, res, next) => {
  res.status(200).json({ received: true });
};
