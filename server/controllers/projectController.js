import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Milestone from '../models/Milestone.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Payment from '../models/Payment.js';
import notificationService from '../services/notificationService.js';
import { mockDB } from '../utils/mockDB.js';

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      clientEmail,
      totalBudget,
      currency = 'USD',
      startDate,
      deadline,
      category,
      additionalRequirements,
    } = req.body;

    if (!title || !description || !clientEmail || !totalBudget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, client email, and total budget.',
      });
    }

    const normalizedClientEmail = clientEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existingClient = await User.findOne({ email: normalizedClientEmail });
      const project = await Project.create({
        title: title.trim(),
        description,
        freelancerId: req.user._id,
        clientId: existingClient ? existingClient._id : null,
        clientEmail: normalizedClientEmail,
        totalBudget: Number(totalBudget),
        currency: currency.toUpperCase(),
        startDate: startDate || new Date(),
        deadline: deadline || null,
        category: category || 'Web Development',
        additionalRequirements: additionalRequirements || '',
        status: 'Planning',
      });

      if (existingClient) {
        await notificationService.notify({
          userId: existingClient._id,
          title: 'New Project Invitation',
          message: `${req.user.name} invited you to project "${project.title}" ($${project.totalBudget} ${project.currency}).`,
          type: 'project_invite',
          projectId: project._id,
        });
      }

      await notificationService.logActivity({
        projectId: project._id,
        userId: req.user._id,
        action: 'Project Created',
        description: `Freelancer ${req.user.name} initialized project "${project.title}".`,
      });

      return res.status(201).json({ success: true, project });
    } else {
      // In-Memory Mode
      const existingClient = mockDB.users.find(
        (u) => u.email.trim().toLowerCase() === normalizedClientEmail
      );
      const newProj = {
        _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        title: title.trim(),
        description,
        freelancerId: req.user._id.toString(),
        clientId: existingClient ? existingClient._id.toString() : null,
        clientEmail: normalizedClientEmail,
        totalBudget: Number(totalBudget),
        currency: currency.toUpperCase(),
        startDate: startDate || new Date(),
        deadline: deadline || null,
        category: category || 'Web Development',
        additionalRequirements: additionalRequirements || '',
        status: 'Planning',
        clientApprovedPlan: false,
        createdAt: new Date(),
      };
      mockDB.projects.unshift(newProj);

      if (existingClient) {
        await notificationService.notify({
          userId: existingClient._id,
          title: 'New Project Invitation',
          message: `${req.user.name} invited you to project "${newProj.title}" ($${newProj.totalBudget} ${newProj.currency}).`,
          type: 'project_invite',
          projectId: newProj._id,
        });
      }

      await notificationService.logActivity({
        projectId: newProj._id,
        userId: req.user._id,
        action: 'Project Created',
        description: `Freelancer ${req.user.name} initialized project "${newProj.title}".`,
      });

      return res.status(201).json({ success: true, project: newProj });
    }
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const normalizedUserEmail = (req.user.email || '').trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (req.user.role === 'freelancer') {
        query = { freelancerId: req.user._id };
      } else {
        query = {
          $or: [{ clientId: req.user._id }, { clientEmail: normalizedUserEmail }],
        };
      }

      const projects = await Project.find(query)
        .populate('freelancerId', 'name email profileImage title')
        .populate('clientId', 'name email profileImage')
        .sort({ createdAt: -1 });

      const enriched = await Promise.all(
        projects.map(async (p) => {
          const milestones = await Milestone.find({ projectId: p._id });
          const total = milestones.length;
          const completed = milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;
          const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          const totalPaidAmount = milestones
            .filter((m) => m.status === 'Paid')
            .reduce((sum, m) => sum + (m.budget || 0), 0);

          return {
            ...p.toObject(),
            milestonesCount: total,
            completedMilestones: completed,
            progressPercentage,
            totalPaidAmount,
          };
        })
      );

      return res.json({ success: true, count: enriched.length, projects: enriched });
    } else {
      // In-Memory Mode
      const userIdStr = req.user._id.toString();

      let userProjects = mockDB.projects.filter((p) => {
        if (req.user.role === 'freelancer') {
          return p.freelancerId?.toString() === userIdStr;
        } else {
          return (
            p.clientId?.toString() === userIdStr ||
            p.clientEmail?.trim().toLowerCase() === normalizedUserEmail
          );
        }
      });

      const enriched = userProjects.map((p) => {
        const pIdStr = p._id.toString();
        const pMilestones = mockDB.milestones.filter((m) => m.projectId?.toString() === pIdStr);
        const total = pMilestones.length;
        const completed = pMilestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const totalPaidAmount = pMilestones
          .filter((m) => m.status === 'Paid')
          .reduce((sum, m) => sum + (m.budget || 0), 0);

        const freelancer = mockDB.users.find((u) => u._id.toString() === p.freelancerId?.toString());
        const client = mockDB.users.find((u) => u._id.toString() === p.clientId?.toString());

        return {
          ...p,
          freelancerId: freelancer
            ? { _id: freelancer._id, name: freelancer.name, email: freelancer.email }
            : null,
          clientId: client ? { _id: client._id, name: client.name, email: client.email } : null,
          milestonesCount: total,
          completedMilestones: completed,
          progressPercentage,
          totalPaidAmount,
        };
      });

      return res.json({ success: true, count: enriched.length, projects: enriched });
    }
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const projId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(projId)
        .populate('freelancerId', 'name email profileImage title bio')
        .populate('clientId', 'name email profileImage');

      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      const milestones = await Milestone.find({ projectId: project._id }).sort({ orderIndex: 1, createdAt: 1 });
      const activities = await ActivityLog.find({ projectId: project._id })
        .populate('userId', 'name role')
        .sort({ createdAt: -1 })
        .limit(20);
      const payments = await Payment.find({ projectId: project._id }).sort({ createdAt: -1 });

      const total = milestones.length;
      const completed = milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;
      const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return res.json({
        success: true,
        project: { ...project.toObject(), progressPercentage },
        milestones,
        activities,
        payments,
      });
    } else {
      // In-Memory Mode
      const project = mockDB.projects.find((p) => p._id.toString() === projId.toString());
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }

      const milestones = mockDB.milestones
        .filter((m) => m.projectId.toString() === projId.toString())
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      const activities = mockDB.activities.filter(
        (a) => a.projectId.toString() === projId.toString()
      );
      const payments = mockDB.payments.filter(
        (p) => p.projectId.toString() === projId.toString()
      );

      const freelancer = mockDB.users.find((u) => u._id.toString() === project.freelancerId?.toString());
      const client = mockDB.users.find((u) => u._id.toString() === project.clientId?.toString());

      const total = milestones.length;
      const completed = milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;
      const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return res.json({
        success: true,
        project: {
          ...project,
          freelancerId: freelancer,
          clientId: client,
          progressPercentage,
        },
        milestones,
        activities,
        payments,
      });
    }
  } catch (err) {
    next(err);
  }
};

const recordPlanDecisionEffects = async ({ project, user, decision, reason }) => {
  if (decision === 'approved') {
    await notificationService.notify({
      userId: project.freelancerId,
      title: 'Project Plan Approved!',
      message: `${user.name} approved the milestone plan for "${project.title}". You can begin work.`,
      type: 'plan_approval',
      projectId: project._id,
    });

    await notificationService.logActivity({
      projectId: project._id,
      userId: user._id,
      action: 'Plan Approved',
      description: `Client ${user.name} approved the milestone breakdown.`,
    });
    return;
  }

  const reasonSuffix = reason ? ` Reason: "${reason}"` : '';
  await notificationService.notify({
    userId: project.freelancerId,
    title: 'Project Invitation Rejected',
    message: `${user.name} rejected the project invitation for "${project.title}".${reasonSuffix}`,
    type: 'plan_rejection',
    projectId: project._id,
  });

  await notificationService.logActivity({
    projectId: project._id,
    userId: user._id,
    action: 'Invitation Rejected',
    description: `Client ${user.name} rejected the project invitation.${reasonSuffix}`,
  });
};

export const updateProject = async (req, res, next) => {
  try {
    const projId = req.params.id;
    const isApproving = req.body.clientApprovedPlan === true;
    const isRejecting =
      !isApproving &&
      (req.body.status === 'Rejected' ||
        req.body.action === 'reject' ||
        req.body.clientApprovedPlan === false);

    if ((isApproving || isRejecting) && req.user?.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only the client can approve or reject a project invitation.',
      });
    }

    const reason =
      typeof req.body.rejectionReason === 'string' ? req.body.rejectionReason.trim() : '';

    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(projId);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

      if (isApproving) {
        project.clientApprovedPlan = true;
        project.status = 'In Progress';
        project.rejectionReason = '';
        project.rejectedAt = null;
        await Milestone.updateMany(
          { projectId: project._id, status: { $in: ['Draft', 'Awaiting Client Approval'] } },
          { status: 'Pending' }
        );
        await recordPlanDecisionEffects({ project, user: req.user, decision: 'approved' });
      } else if (isRejecting) {
        project.clientApprovedPlan = false;
        project.status = 'Rejected';
        project.rejectionReason = reason;
        project.rejectedAt = new Date();
        await recordPlanDecisionEffects({ project, user: req.user, decision: 'rejected', reason });
      }

      await project.save();
      return res.json({ success: true, project });
    } else {
      // In-Memory Mode
      const project = mockDB.projects.find((p) => p._id.toString() === projId.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

      if (isApproving) {
        project.clientApprovedPlan = true;
        project.status = 'In Progress';
        project.rejectionReason = '';
        project.rejectedAt = null;
        mockDB.milestones.forEach((m) => {
          if (
            m.projectId.toString() === projId.toString() &&
            (m.status === 'Draft' || m.status === 'Awaiting Client Approval')
          ) {
            m.status = 'Pending';
          }
        });
        await recordPlanDecisionEffects({ project, user: req.user, decision: 'approved' });
      } else if (isRejecting) {
        project.clientApprovedPlan = false;
        project.status = 'Rejected';
        project.rejectionReason = reason;
        project.rejectedAt = new Date();
        await recordPlanDecisionEffects({ project, user: req.user, decision: 'rejected', reason });
      }

      return res.json({ success: true, project });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const projId = req.params.id;
    if (mongoose.connection.readyState === 1) {
      await Milestone.deleteMany({ projectId: projId });
      await ActivityLog.deleteMany({ projectId: projId });
      await Project.findByIdAndDelete(projId);
    } else {
      mockDB.projects = mockDB.projects.filter((p) => p._id.toString() !== projId.toString());
      mockDB.milestones = mockDB.milestones.filter((m) => m.projectId.toString() !== projId.toString());
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};
