import mongoose from 'mongoose';
import Milestone from '../models/Milestone.js';
import Project from '../models/Project.js';
import notificationService from '../services/notificationService.js';
import { mockDB } from '../utils/mockDB.js';

export const createMilestone = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, tasks, budget, startDate, deadline, completionCriteria } = req.body;

    const formattedTasks = Array.isArray(tasks)
      ? tasks.map((t) => (typeof t === 'string' ? { title: t, completed: false } : t))
      : [];

    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      const count = await Milestone.countDocuments({ projectId });
      const milestone = await Milestone.create({
        projectId,
        title,
        description: description || '',
        tasks: formattedTasks,
        budget: Number(budget) || 0,
        orderIndex: count + 1,
        startDate: startDate || null,
        deadline: deadline || null,
        completionCriteria: completionCriteria || '',
        status: project.clientApprovedPlan ? 'Pending' : 'Draft',
      });

      return res.status(201).json({ success: true, milestone });
    } else {
      const project = mockDB.projects.find((p) => p._id.toString() === projectId.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      const count = mockDB.milestones.filter((m) => m.projectId.toString() === projectId.toString()).length;
      const milestone = {
        _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        projectId: projectId.toString(),
        title,
        description: description || '',
        tasks: formattedTasks,
        budget: Number(budget) || 0,
        orderIndex: count + 1,
        startDate: startDate || null,
        deadline: deadline || null,
        completionCriteria: completionCriteria || '',
        status: project.clientApprovedPlan ? 'Pending' : 'Draft',
        createdAt: new Date(),
      };
      mockDB.milestones.push(milestone);
      return res.status(201).json({ success: true, milestone });
    }
  } catch (err) {
    next(err);
  }
};

export const createBulkMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { milestones } = req.body;

    if (mongoose.connection.readyState === 1) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      await Milestone.deleteMany({ projectId, status: { $in: ['Draft', 'Awaiting Client Approval', 'Pending'] } });

      const docs = milestones.map((m, idx) => ({
        projectId,
        title: m.title,
        description: m.description || '',
        budget: Number(m.budget) || 0,
        orderIndex: idx + 1,
        startDate: m.startDate || null,
        deadline: m.deadline || null,
        completionCriteria: m.completionCriteria || '',
        status: 'Awaiting Client Approval',
        tasks: Array.isArray(m.tasks)
          ? m.tasks.map((t) => (typeof t === 'string' ? { title: t, completed: false } : t))
          : [],
      }));

      const savedMilestones = await Milestone.insertMany(docs);
      project.status = 'Awaiting Client Approval';
      await project.save();

      return res.status(201).json({ success: true, count: savedMilestones.length, milestones: savedMilestones });
    } else {
      const project = mockDB.projects.find((p) => p._id.toString() === projectId.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      mockDB.milestones = mockDB.milestones.filter(
        (m) =>
          !(
            m.projectId.toString() === projectId.toString() &&
            ['Draft', 'Awaiting Client Approval', 'Pending'].includes(m.status)
          )
      );

      const docs = milestones.map((m, idx) => ({
        _id: '6600000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        projectId: projectId.toString(),
        title: m.title,
        description: m.description || '',
        budget: Number(m.budget) || 0,
        orderIndex: idx + 1,
        startDate: m.startDate || null,
        deadline: m.deadline || null,
        completionCriteria: m.completionCriteria || '',
        status: 'Awaiting Client Approval',
        tasks: Array.isArray(m.tasks)
          ? m.tasks.map((t) => (typeof t === 'string' ? { title: t, completed: false } : t))
          : [],
        createdAt: new Date(),
      }));

      mockDB.milestones.push(...docs);
      project.status = 'Awaiting Client Approval';

      return res.status(201).json({ success: true, count: docs.length, milestones: docs });
    }
  } catch (err) {
    next(err);
  }
};

export const getMilestonesByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const milestones = await Milestone.find({ projectId }).sort({ orderIndex: 1, createdAt: 1 });
      return res.json({ success: true, count: milestones.length, milestones });
    } else {
      const milestones = mockDB.milestones
        .filter((m) => m.projectId.toString() === projectId.toString())
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      return res.json({ success: true, count: milestones.length, milestones });
    }
  } catch (err) {
    next(err);
  }
};

export const getMilestoneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const milestone = await Milestone.findById(id).populate('projectId');
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      return res.json({ success: true, milestone });
    } else {
      const milestone = mockDB.milestones.find((m) => m._id.toString() === id.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      return res.json({ success: true, milestone });
    }
  } catch (err) {
    next(err);
  }
};

export const updateMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const milestone = await Milestone.findById(id);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

      if (req.body.tasks) milestone.tasks = req.body.tasks;
      if (req.body.status) milestone.status = req.body.status;
      if (req.body.title) milestone.title = req.body.title;
      if (req.body.description !== undefined) milestone.description = req.body.description;
      if (req.body.budget) milestone.budget = req.body.budget;
      await milestone.save();
      return res.json({ success: true, milestone });
    } else {
      const milestone = mockDB.milestones.find((m) => m._id.toString() === id.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

      if (req.body.tasks) milestone.tasks = req.body.tasks;
      if (req.body.status) milestone.status = req.body.status;
      if (req.body.title) milestone.title = req.body.title;
      if (req.body.description !== undefined) milestone.description = req.body.description;
      if (req.body.budget) milestone.budget = req.body.budget;
      return res.json({ success: true, milestone });
    }
  } catch (err) {
    next(err);
  }
};

export const submitMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliverables, submissionNotes } = req.body;

    let milestone;
    let project;

    if (mongoose.connection.readyState === 1) {
      milestone = await Milestone.findById(id);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = await Project.findById(milestone.projectId);

      milestone.deliverables = deliverables || [];
      milestone.submissionNotes = submissionNotes || '';
      milestone.submittedAt = new Date();
      milestone.status = 'Submitted for Review';
      await milestone.save();
    } else {
      milestone = mockDB.milestones.find((m) => m._id.toString() === id.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = mockDB.projects.find((p) => p._id.toString() === milestone.projectId.toString());

      milestone.deliverables = deliverables || [];
      milestone.submissionNotes = submissionNotes || '';
      milestone.submittedAt = new Date();
      milestone.status = 'Submitted for Review';
    }

    if (project?.clientId) {
      await notificationService.notify({
        userId: project.clientId,
        title: 'Milestone Submitted for Review',
        message: `${req.user.name} submitted deliverables for milestone "${milestone.title}". Please inspect and approve.`,
        type: 'submission',
        projectId: project._id,
        milestoneId: milestone._id,
      });
    }

    await notificationService.logActivity({
      projectId: project._id,
      userId: req.user._id,
      action: 'Deliverables Submitted',
      description: `Freelancer submitted work for "${milestone.title}".`,
    });

    res.json({ success: true, message: 'Submitted for review', milestone });
  } catch (err) {
    next(err);
  }
};

export const approveMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    let milestone;
    let project;

    if (mongoose.connection.readyState === 1) {
      milestone = await Milestone.findById(id);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = await Project.findById(milestone.projectId);

      milestone.status = 'Approved';
      milestone.paymentStatus = 'Awaiting Approval';
      milestone.approvedAt = new Date();
      milestone.clientFeedback = req.body.feedback || 'Approved by client.';
      await milestone.save();
    } else {
      milestone = mockDB.milestones.find((m) => m._id.toString() === id.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = mockDB.projects.find((p) => p._id.toString() === milestone.projectId.toString());

      milestone.status = 'Approved';
      milestone.paymentStatus = 'Awaiting Approval';
      milestone.approvedAt = new Date();
      milestone.clientFeedback = req.body.feedback || 'Approved by client.';
    }

    await notificationService.notify({
      userId: project.freelancerId,
      title: 'Milestone Approved! 👏',
      message: `Client approved milestone "${milestone.title}" ($${milestone.budget}). Payment is pending release.`,
      type: 'milestone_approval',
      projectId: project._id,
      milestoneId: milestone._id,
    });

    await notificationService.logActivity({
      projectId: project._id,
      userId: req.user._id,
      action: 'Milestone Approved',
      description: `Client approved "${milestone.title}". Payment button enabled.`,
    });

    res.json({ success: true, message: 'Milestone approved. PayPal checkout unlocked.', milestone });
  } catch (err) {
    next(err);
  }
};

export const requestRevision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    let milestone;
    let project;

    if (mongoose.connection.readyState === 1) {
      milestone = await Milestone.findById(id);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = await Project.findById(milestone.projectId);

      milestone.status = 'Revision Requested';
      milestone.clientFeedback = feedback;
      await milestone.save();
    } else {
      milestone = mockDB.milestones.find((m) => m._id.toString() === id.toString());
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
      project = mockDB.projects.find((p) => p._id.toString() === milestone.projectId.toString());

      milestone.status = 'Revision Requested';
      milestone.clientFeedback = feedback;
    }

    await notificationService.notify({
      userId: project.freelancerId,
      title: 'Revision Requested',
      message: `Client requested changes on "${milestone.title}": "${feedback}"`,
      type: 'revision_request',
      projectId: project._id,
      milestoneId: milestone._id,
    });

    res.json({ success: true, message: 'Revision request sent', milestone });
  } catch (err) {
    next(err);
  }
};
