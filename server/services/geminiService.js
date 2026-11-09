import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      this.ai = null;
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY');
  }

  /**
   * Generates structured project milestones using Gemini 3.8 Flash
   */
  async generateMilestones({
    title,
    description,
    budget,
    startDate,
    deadline,
    category,
    additionalRequirements,
  }) {
    if (!this.isConfigured()) {
      return this.fallbackMilestoneGenerator({
        title,
        description,
        budget,
        startDate,
        deadline,
        category,
      });
    }

    try {
      const prompt = `You are an expert technical project manager and software architect.
Generate a structured, logical project milestone breakdown for the following freelance project:

Project Title: ${title}
Category: ${category || 'Software / Web Development'}
Description: ${description}
Total Budget: $${budget}
Start Date: ${startDate || new Date().toISOString().split('T')[0]}
Expected Deadline: ${deadline || 'Flexible within reasonable timeline'}
Additional Requirements: ${additionalRequirements || 'None'}

Requirements for Milestones:
1. Divide the project into 4 to 6 logical milestones (e.g. Discovery & Architecture, UI/UX Design & Prototyping, Core Features & API, Integration & Testing, Final Deployment & Handover).
2. Distribute the total budget of $${budget} across all milestones so that the sum of all milestone budgets EXACTLY equals ${budget}.
3. Each milestone must have realistic start and end dates within the timeframe.
4. Each milestone must include 3 to 5 clear, actionable tasks.
5. Provide clear, objective completion criteria for each milestone.

Return strictly valid JSON format matching this schema:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "Short description of the milestone goals and scope",
      "budget": 500,
      "startDate": "YYYY-MM-DD",
      "deadline": "YYYY-MM-DD",
      "completionCriteria": "Objective verification criteria for client approval",
      "tasks": [
        "Task 1 description",
        "Task 2 description",
        "Task 3 description"
      ]
    }
  ]
}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text;
      const parsed = JSON.parse(responseText);

      if (parsed && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        return parsed.milestones;
      }
      throw new Error('Invalid JSON structure returned by Gemini');
    } catch (error) {
      console.warn('Gemini API call failed or schema parse error, using smart fallback:', error.message);
      return this.fallbackMilestoneGenerator({
        title,
        description,
        budget,
        startDate,
        deadline,
        category,
      });
    }
  }

  /**
   * Generates a natural language progress summary
   */
  async generateProgressSummary({ project, milestones }) {
    const completed = milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;
    const inProgress = milestones.filter((m) => m.status === 'In Progress' || m.status === 'Submitted for Review').length;
    const pending = milestones.filter((m) => m.status === 'Pending' || m.status === 'Draft' || m.status === 'Awaiting Client Approval').length;
    const total = milestones.length;

    if (!this.isConfigured()) {
      return `Project "${project.title}" is currently progressing. ${completed} of ${total} milestones have been approved or paid, ${inProgress} milestone(s) are active, and ${pending} remain in queue. Track deliverables closely to ensure timely milestone payments through PayPal.`;
    }

    try {
      const prompt = `You are MilestoneMate's AI Project Advisor.
Summarize the current health and status of this project:
Title: ${project.title}
Total Budget: $${project.totalBudget} ${project.currency}
Milestones Summary:
- Total: ${total}
- Completed/Paid: ${completed}
- In Progress/Review: ${inProgress}
- Pending: ${pending}

Milestones Detail:
${milestones
  .map(
    (m, idx) =>
      `${idx + 1}. ${m.title} - Status: ${m.status}, Budget: $${m.budget}, Deadline: ${m.deadline ? new Date(m.deadline).toLocaleDateString() : 'N/A'}`
  )
  .join('\n')}

Provide an executive 2-paragraph progress assessment and 2 strategic recommendations for both the freelancer and client. Keep it concise, professional, and encouraging.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.warn('Gemini summary failed, using fallback:', error.message);
      return `Project "${project.title}" is progressing well. Completed: ${completed}/${total} milestones. Keep deliverables documented to facilitate smooth PayPal approvals.`;
    }
  }

  /**
   * Generates next task recommendations & delay analysis
   */
  async generateNextTaskAdvice({ project, milestones }) {
    const currentMilestone =
      milestones.find((m) => m.status === 'In Progress') ||
      milestones.find((m) => m.status === 'Submitted for Review') ||
      milestones.find((m) => m.status === 'Pending') ||
      milestones[0];

    if (!currentMilestone) {
      return {
        nextAction: 'Create your first milestone or finalize project setup.',
        urgency: 'low',
        recommendations: ['Define milestone deliverables', 'Establish communication channel with client'],
      };
    }

    if (!this.isConfigured()) {
      const overdue = currentMilestone.deadline && new Date(currentMilestone.deadline) < new Date();
      return {
        currentFocus: currentMilestone.title,
        status: currentMilestone.status,
        overdue: Boolean(overdue),
        nextAction:
          currentMilestone.status === 'In Progress'
            ? 'Complete assigned tasks and prepare deliverable links for client review.'
            : currentMilestone.status === 'Submitted for Review'
            ? 'Client should review submitted deliverables and approve or request revisions.'
            : currentMilestone.status === 'Approved'
            ? 'Client can proceed to PayPal checkout to release payment.'
            : 'Begin work on the milestone tasks.',
        recommendations: [
          'Verify all acceptance criteria before submitting',
          'Keep milestone deliverables organized for seamless PayPal payment release',
        ],
      };
    }

    try {
      const prompt = `As MilestoneMate's AI Assistant, analyze this milestone:
Project: ${project.title}
Current Milestone: ${currentMilestone.title}
Status: ${currentMilestone.status}
Budget: $${currentMilestone.budget}
Deadline: ${currentMilestone.deadline}
Tasks: ${JSON.stringify(currentMilestone.tasks)}

Provide a structured JSON output with:
{
  "currentFocus": "...",
  "status": "...",
  "overdue": true/false,
  "nextAction": "Concise recommended immediate action",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      return JSON.parse(response.text);
    } catch (err) {
      return {
        currentFocus: currentMilestone.title,
        status: currentMilestone.status,
        overdue: false,
        nextAction: 'Continue progress on assigned tasks and update completion status.',
        recommendations: ['Ensure deliverables meet the agreed completion criteria.'],
      };
    }
  }

  /**
   * Smart heuristic milestone generator used as fallback or offline mode
   */
  fallbackMilestoneGenerator({ title, description, budget, startDate, deadline, category }) {
    const total = Number(budget) || 1000;
    const start = startDate ? new Date(startDate) : new Date();
    const end = deadline ? new Date(deadline) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    const totalDuration = Math.max(end.getTime() - start.getTime(), 7 * 24 * 60 * 60 * 1000);

    const stepDuration = totalDuration / 4;

    const b1 = Math.round(total * 0.2);
    const b2 = Math.round(total * 0.3);
    const b3 = Math.round(total * 0.3);
    const b4 = total - (b1 + b2 + b3); // ensures exact sum equals total budget

    return [
      {
        title: 'Milestone 1: Discovery, Architecture & Specifications',
        description: `Analyze requirements for "${title}", define system architecture, data models, and finalize project roadmap.`,
        budget: b1,
        startDate: new Date(start.getTime()).toISOString().split('T')[0],
        deadline: new Date(start.getTime() + stepDuration).toISOString().split('T')[0],
        completionCriteria: 'Approved technical specification document and visual wireframes.',
        tasks: [
          'Requirement gathering and scope alignment',
          'Architecture and database schema design',
          'UI/UX wireframes and prototype sign-off',
        ],
      },
      {
        title: 'Milestone 2: Core Frontend & User Interface',
        description: 'Build responsive frontend views, state management, and navigation structure.',
        budget: b2,
        startDate: new Date(start.getTime() + stepDuration).toISOString().split('T')[0],
        deadline: new Date(start.getTime() + stepDuration * 2).toISOString().split('T')[0],
        completionCriteria: 'Functional UI components, navigation, and interactive layouts demonstrated on staging.',
        tasks: [
          'Develop reusable UI component library',
          'Implement page routes and form validation',
          'Connect state management and user interface flows',
        ],
      },
      {
        title: 'Milestone 3: Backend API & Service Integration',
        description: 'Develop RESTful endpoints, business logic, authentication, and external service connectors.',
        budget: b3,
        startDate: new Date(start.getTime() + stepDuration * 2).toISOString().split('T')[0],
        deadline: new Date(start.getTime() + stepDuration * 3).toISOString().split('T')[0],
        completionCriteria: 'All API routes passing integration tests and connected with database.',
        tasks: [
          'Develop secure REST APIs and middleware',
          'Implement business logic and data persistence',
          'Perform end-to-end frontend-backend integration',
        ],
      },
      {
        title: 'Milestone 4: Testing, Deployment & Handover',
        description: 'Quality assurance, bug fixes, deployment to cloud infrastructure, and final client walkthrough.',
        budget: b4,
        startDate: new Date(start.getTime() + stepDuration * 3).toISOString().split('T')[0],
        deadline: new Date(end.getTime()).toISOString().split('T')[0],
        completionCriteria: 'Deployed production URL, source code repository transfer, and complete project documentation.',
        tasks: [
          'Run automated and cross-browser quality checks',
          'Deploy application to cloud hosting and verify live environment',
          'Deliver final documentation, assets, and project walkthrough',
        ],
      },
    ];
  }
}

export default new GeminiService();
