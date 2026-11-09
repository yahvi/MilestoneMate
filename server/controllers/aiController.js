import mongoose from 'mongoose';
import geminiService from '../services/geminiService.js';
import Project from '../models/Project.js';
import Milestone from '../models/Milestone.js';
import { mockDB } from '../utils/mockDB.js';

export const generateMilestones = async (req, res, next) => {
  try {
    const { title, description, budget, startDate, deadline, category, additionalRequirements } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title, description, and budget.',
      });
    }

    const milestones = await geminiService.generateMilestones({
      title,
      description,
      budget: Number(budget),
      startDate,
      deadline,
      category,
      additionalRequirements,
    });

    res.json({
      success: true,
      count: milestones.length,
      milestones,
    });
  } catch (err) {
    next(err);
  }
};

export const getProgressSummary = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required.' });
    }

    let project;
    let milestones;

    if (mongoose.connection.readyState === 1) {
      project = await Project.findById(projectId);
      milestones = await Milestone.find({ projectId });
    } else {
      project = mockDB.projects.find((p) => p._id.toString() === projectId.toString());
      milestones = mockDB.milestones.filter((m) => m.projectId.toString() === projectId.toString());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const summary = await geminiService.generateProgressSummary({ project, milestones });

    res.json({
      success: true,
      summary,
    });
  } catch (err) {
    next(err);
  }
};

export const getNextTaskAdvice = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required.' });
    }

    let project;
    let milestones;

    if (mongoose.connection.readyState === 1) {
      project = await Project.findById(projectId);
      milestones = await Milestone.find({ projectId });
    } else {
      project = mockDB.projects.find((p) => p._id.toString() === projectId.toString());
      milestones = mockDB.milestones.filter((m) => m.projectId.toString() === projectId.toString());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const advice = await geminiService.generateNextTaskAdvice({ project, milestones });

    res.json({
      success: true,
      advice,
    });
  } catch (err) {
    next(err);
  }
};

export const getDelayAnalysis = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    let project;
    let milestones;

    if (mongoose.connection.readyState === 1) {
      project = await Project.findById(projectId);
      milestones = await Milestone.find({ projectId });
    } else {
      project = mockDB.projects.find((p) => p._id.toString() === projectId.toString());
      milestones = mockDB.milestones.filter((m) => m.projectId.toString() === projectId.toString());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const now = new Date();
    const overdueMilestones = milestones.filter(
      (m) => m.deadline && new Date(m.deadline) < now && m.status !== 'Approved' && m.status !== 'Paid'
    );

    const completionRate =
      milestones.length > 0
        ? Math.round(
            (milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length /
              milestones.length) *
              100
          )
        : 0;

    res.json({
      success: true,
      completionRate,
      totalMilestones: milestones.length,
      overdueCount: overdueMilestones.length,
      overdueMilestones: overdueMilestones.map((m) => ({
        id: m._id,
        title: m.title,
        deadline: m.deadline,
        status: m.status,
      })),
      isDelayed: overdueMilestones.length > 0,
    });
  } catch (err) {
    next(err);
  }
};
