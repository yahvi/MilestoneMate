import bcrypt from 'bcryptjs';

// In-Memory Database store used when MongoDB is not connected
class MockDB {
  constructor() {
    this.users = [];
    this.projects = [];
    this.milestones = [];
    this.payments = [];
    this.notifications = [];
    this.activities = [];
    this.initDemoData();
  }

  async initDemoData() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const alexId = '660000000000000000000001';
    const sarahId = '660000000000000000000002';
    const projId = '660000000000000000000010';
    const m1Id = '660000000000000000000021';
    const m2Id = '660000000000000000000022';
    const m3Id = '660000000000000000000023';
    const m4Id = '660000000000000000000024';

    this.users = [
      {
        _id: alexId,
        name: 'Alex Rivera',
        email: 'alex@milestonemate.dev',
        password: passwordHash,
        role: 'freelancer',
        title: 'Senior Full Stack & AI Engineer',
        bio: 'Specializing in React, Node.js, and PayPal integrations.',
        paypalEmail: 'alex-seller@sandbox.paypal.com',
        createdAt: new Date(),
      },
      {
        _id: sarahId,
        name: 'Sarah Chen',
        email: 'sarah@company.com',
        password: passwordHash,
        role: 'client',
        title: 'VP of Product at Zenith Retail',
        bio: 'Building modern consumer commerce applications.',
        paypalEmail: 'sarah-buyer@sandbox.paypal.com',
        createdAt: new Date(),
      },
    ];

    this.projects = [
      {
        _id: projId,
        title: 'E-commerce Website Development',
        description:
          'Develop an online shopping platform with user authentication, product catalog, cart, checkout with PayPal Sandbox, and an administrative inventory dashboard.',
        freelancerId: alexId,
        clientId: sarahId,
        clientEmail: 'sarah@company.com',
        totalBudget: 4500,
        currency: 'USD',
        category: 'Web Development',
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        clientApprovedPlan: true,
        additionalRequirements: 'Mobile responsive, sub-second page loads, PayPal sandbox testing.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];

    this.milestones = [
      {
        _id: m1Id,
        projectId: projId,
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
          { title: 'Draft database schemas & API endpoints', completed: true },
          { title: 'Design Figma wireframes for storefront and dashboard', completed: true },
        ],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        _id: m2Id,
        projectId: projId,
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
          { title: 'Implement shopping cart state management', completed: true },
          { title: 'Create product detail modal and quick view', completed: true },
        ],
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        _id: m3Id,
        projectId: projId,
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
        createdAt: new Date(),
      },
      {
        _id: m4Id,
        projectId: projId,
        title: 'Milestone 4: Admin Dashboard & Production Release',
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
        createdAt: new Date(),
      },
    ];

    this.payments = [
      {
        _id: '660000000000000000000031',
        projectId: projId,
        milestoneId: m1Id,
        payerId: sarahId,
        payeeId: alexId,
        amount: 900,
        currency: 'USD',
        provider: 'paypal',
        paypalOrderId: 'SANDBOX-ORDER-DEMO-001',
        paypalCaptureId: 'SANDBOX-CAP-DEMO-001',
        status: 'Paid',
        capturedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    this.notifications = [
      {
        _id: '660000000000000000000041',
        userId: sarahId,
        title: 'Milestone 2 Ready for Payment',
        message: 'Milestone 2 is approved. Click "Pay Now" to release $1,200 via PayPal Sandbox.',
        type: 'milestone_approval',
        relatedProjectId: projId,
        relatedMilestoneId: m2Id,
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        _id: '660000000000000000000042',
        userId: alexId,
        title: 'Payment Received ($900.00)',
        message: 'Verified PayPal payment received for Milestone 1: Requirement Analysis.',
        type: 'payment_success',
        relatedProjectId: projId,
        relatedMilestoneId: m1Id,
        isRead: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    this.activities = [
      {
        _id: '660000000000000000000051',
        projectId: projId,
        userId: sarahId,
        action: 'Milestone Approved',
        description: 'Client approved Milestone 2: UI/UX Storefront & Product Catalog.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        _id: '660000000000000000000052',
        projectId: projId,
        userId: alexId,
        action: 'Payment Captured',
        description: 'PayPal payment of $900 captured for Milestone 1.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }
}

export const mockDB = new MockDB();
