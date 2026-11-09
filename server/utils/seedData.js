import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Milestone from '../models/Milestone.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import connectDB from '../config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('Creating demo users...');
    const freelancer = await User.create({
      name: 'Alex Rivera',
      email: 'alex@milestonemate.dev',
      password: 'password123',
      role: 'freelancer',
      title: 'Senior Full Stack & AI Engineer',
      bio: 'Specializing in React, Node.js, and PayPal integrations.',
      paypalEmail: 'alex-seller@sandbox.paypal.com',
    });

    const client = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      password: 'password123',
      role: 'client',
      title: 'VP of Product at Zenith Retail',
      bio: 'Building modern consumer commerce applications.',
      paypalEmail: 'sarah-buyer@sandbox.paypal.com',
    });

    console.log('Creating sample project...');
    const project = await Project.create({
      title: 'E-commerce Website Development',
      description: 'Develop an online shopping platform with user authentication, product catalog, cart, checkout with PayPal, and admin inventory dashboard.',
      freelancerId: freelancer._id,
      clientId: client._id,
      clientEmail: client.email,
      totalBudget: 4500,
      currency: 'USD',
      category: 'E-Commerce / Web Development',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
      clientApprovedPlan: true,
      additionalRequirements: 'Mobile responsive, sub-second page loads, PayPal sandbox testing.',
    });

    console.log('Creating milestones...');
    // Milestone 1: Completed & Paid
    const m1 = await Milestone.create({
      projectId: project._id,
      title: 'Milestone 1: Requirement Analysis & System Architecture',
      description: 'Define system specifications, data models, wireframes, and tech stack blueprint.',
      budget: 900,
      orderIndex: 1,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'Paid',
      paymentStatus: 'Paid',
      completionCriteria: 'Wireframe prototypes and architecture specification signed off.',
      deliverables: [{ name: 'System_Architecture_v1.pdf', url: 'https://github.com/milestonemate/docs/arch.pdf' }],
      submissionNotes: 'All architecture diagrams and API specs finalized.',
      submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      paypalOrderId: 'SANDBOX-ORDER-DEMO-001',
      paypalCaptureId: 'SANDBOX-CAP-DEMO-001',
      tasks: [
        { title: 'Understand client requirements & target user persona', completed: true },
        { title: 'Draft MongoDB database schemas & API endpoints', completed: true },
        { title: 'Design Figma wireframes for storefront and dashboard', completed: true },
      ],
    });

    // Record Payment 1
    await Payment.create({
      projectId: project._id,
      milestoneId: m1._id,
      payerId: client._id,
      payeeId: freelancer._id,
      amount: 900,
      currency: 'USD',
      provider: 'paypal',
      paypalOrderId: 'SANDBOX-ORDER-DEMO-001',
      paypalCaptureId: 'SANDBOX-CAP-DEMO-001',
      status: 'Paid',
      capturedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    // Milestone 2: Approved (Ready to Pay Now!)
    const m2 = await Milestone.create({
      projectId: project._id,
      title: 'Milestone 2: UI/UX Storefront & Product Catalog',
      description: 'Implement responsive React storefront with category browsing, product search, and cart preview.',
      budget: 1200,
      orderIndex: 2,
      startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'Approved',
      paymentStatus: 'Awaiting Approval',
      completionCriteria: 'Working catalog UI with cart persistence and product filtering.',
      deliverables: [{ name: 'Staging_Deployment_URL.url', url: 'https://staging.ecommerce-demo.app' }],
      submissionNotes: 'Storefront UI ready with sample catalog items.',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      clientFeedback: 'Looks clean and fast! Approved for milestone payment.',
      tasks: [
        { title: 'Build responsive grid for product listing', completed: true },
        { title: 'Implement local shopping cart state management', completed: true },
        { title: 'Create product detail modal and quick view', completed: true },
      ],
    });

    // Milestone 3: In Progress
    const m3 = await Milestone.create({
      projectId: project._id,
      title: 'Milestone 3: Backend APIs & PayPal Checkout',
      description: 'Integrate PayPal REST API, order capture endpoints, and secure order confirmation pipeline.',
      budget: 1400,
      orderIndex: 3,
      startDate: new Date(),
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
      paymentStatus: 'Not Started',
      completionCriteria: 'PayPal Sandbox buttons functional and verified server-side.',
      tasks: [
        { title: 'Configure PayPal Sandbox environment and OAuth2 token handling', completed: true },
        { title: 'Implement PayPal Orders API server endpoints', completed: false },
        { title: 'Connect front-end checkout button with server order capture', completed: false },
      ],
    });

    // Milestone 4: Pending
    const m4 = await Milestone.create({
      projectId: project._id,
      title: 'Milestone 4: Admin Dashboard, Testing & Production Release',
      description: 'Admin order management, security audit, and deployment on Render/Vercel.',
      budget: 1000,
      orderIndex: 4,
      startDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'Pending',
      paymentStatus: 'Not Started',
      completionCriteria: 'Production deployment with zero critical bugs.',
      tasks: [
        { title: 'Admin panel for inventory and sales tracking', completed: false },
        { title: 'End-to-end sandbox payment integration testing', completed: false },
        { title: 'Deployment and client training handover', completed: false },
      ],
    });

    console.log('Creating demo notifications...');
    await Notification.create([
      {
        userId: client._id,
        title: 'Milestone 2 Ready for Payment',
        message: 'Milestone 2 is approved. Click "Pay Now" to release $1,200 via PayPal Sandbox.',
        type: 'milestone_approval',
        relatedProjectId: project._id,
        relatedMilestoneId: m2._id,
      },
      {
        userId: freelancer._id,
        title: 'Payment Received ($900.00)',
        message: 'Verified PayPal payment received for Milestone 1: Requirement Analysis.',
        type: 'payment_success',
        relatedProjectId: project._id,
        relatedMilestoneId: m1._id,
      },
    ]);

    console.log('Creating activity logs...');
    await ActivityLog.create([
      {
        projectId: project._id,
        userId: client._id,
        action: 'Milestone Approved',
        description: 'Client approved Milestone 2: UI/UX Storefront & Product Catalog.',
      },
      {
        projectId: project._id,
        userId: freelancer._id,
        action: 'Payment Captured',
        description: 'PayPal payment of $900 captured for Milestone 1.',
      },
    ]);

    console.log('✅ Demo database seeded successfully!');
    console.log('Credentials:');
    console.log('Freelancer: alex@milestonemate.dev / password123');
    console.log('Client: sarah@company.com / password123');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

if (process.argv[2] === '--run') {
  seedDatabase().then(() => process.exit(0));
}
