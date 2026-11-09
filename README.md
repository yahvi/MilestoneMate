# MilestoneMate 🚀
> **Tagline:** Build trust. Track progress. Get paid milestone by milestone.

MilestoneMate is an AI-powered freelance project management and milestone settlement platform built for the **Build What's Next with PayPal and AI** Global Hackathon.

Instead of handling freelance projects as one large black-box with an all-or-nothing final payment, MilestoneMate divides contracts into structured, measurable milestones. **Google Gemini AI** analyzes project scope to generate realistic milestones, tasks, and budgets. Clients review submitted deliverables and approve each phase before triggering verified payments via **PayPal**.

---

## 🏆 Hackathon Sponsor Highlights

| Sponsor / Technology | Meaningful Integration in MilestoneMate |
|---|---|
| **PayPal Developer Platform** | **Core Payment Engine:** Authoritative backend-driven PayPal Orders API (`/v2/checkout/orders` create and capture), Sandbox Smart Buttons via `@paypal/react-paypal-js`, verified capture status validation, and tamper-proof payment ledgers. |
| **Google Gemini AI** | **AI Architect & Advisor:** Powered by `gemini-3.8-flash` via `@google/genai`. Generates structured milestones, dynamic executive progress reports, next-step recommendations, and automated timeline delay analysis. |
| **AG Grid** | **Interactive Portfolio & Ledger:** High-performance data tables for both Freelancer & Client dashboards and the Payment Ledger, with custom status badges, sorting, and inline filtering. |

---

## 🌟 Key Features

1. **Gemini AI Milestone Generator:** Turn a brief project description and total budget into 4–6 structured milestones with actionable tasks, deadlines, and budget allocations.
2. **Authoritative PayPal Payouts:** Milestone amounts are strictly enforced from MongoDB on the server—never trusting client-side request amounts.
3. **Stage-Gate Deliverable Approvals:** Freelancers submit deliverable URLs and notes. Clients review and either approve (unlocking PayPal checkout) or request revisions with inline feedback.
4. **Idempotent Payment Capture:** Server-side verification of PayPal order captures prevents double payments and records immutable transaction receipts.
5. **Gemini AI Progress Advisor:** Executive health summaries, proactive recommendations for next actions, and automated overdue task detection.
6. **Role-Based Access Control:** Strict role segregation between Freelancers and Clients with JWT authentication.
7. **Real-Time In-App Notifications:** Instant alerts for project invites, plan approvals, deliverable submissions, revision requests, and payment confirmations.

---

## 🏗️ System Architecture

```
[ React + Vite Client (Port 5173) ]
  ├── Landing Page, Dashboards, AI Generator, Project Cockpit, Payment Ledger
  ├── PayPal Smart Buttons (@paypal/react-paypal-js)
  ├── AG Grid Interactive Data Tables
  └── Tailwind CSS Modern UI
            │
            ▼ (REST API / JWT Auth)
[ Node.js + Express Server (Port 5000) ]
  ├── Auth & Role-Based Middleware
  ├── PayPal REST API Service (Sandbox v2 Orders & Capture)
  ├── Gemini AI Service (gemini-3.8-flash via @google/genai)
  ├── Notification & Activity Audit Service
  └── MongoDB Database / Resilient In-Memory Fallback
```

---

## 👥 Instant Hackathon Demo Accounts

MilestoneMate includes pre-seeded demo accounts with a pre-configured project (*"E-commerce Website Development"*) and sample milestones in various states (Paid, Approved ready for PayPal checkout, and In Progress):

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Freelancer** | `alex@milestonemate.dev` | `password123` | Create projects, prompt Gemini AI, track tasks, submit deliverables. |
| **Client** | `sarah@company.com` | `password123` | Review deliverables, approve milestones, click **Pay Now with PayPal**, inspect payment ledger. |

> 💡 **Quick Switcher:** The top navigation bar includes **1-Click Demo Buttons** to instantly log in as Alex or Sarah without typing!

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18 (Tested on Node 24)
- npm >= 9

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/MilestoneMate.git
cd MilestoneMate

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/milestonemate
JWT_SECRET=milestonemate_super_secure_jwt_secret_dev_2026
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_CLIENT_SECRET
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_URL=/api
VITE_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
```

*(Note: If you run without external API keys, MilestoneMate automatically runs in resilient Sandbox test mode so evaluators can test 100% of the workflow without getting blocked!)*

### 3. Run Locally

**Start the Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Start the Frontend:**
```bash
cd client
npm run dev
# Vite client starts on http://localhost:5173
```

Open your browser to `http://localhost:5173`!

---

## 🧪 Run Automated End-to-End Verification

MilestoneMate includes an end-to-end automated test suite verifying all 11 steps of the specification:

```bash
cd server
node test-flow.js
```

**Verified Test Steps:**
1. Health check & configuration
2. Freelancer authentication & JWT verification
3. Client authentication & role guards
4. Gemini AI structured milestone generation
5. Project portfolio retrieval with AG Grid data structure
6. Project Cockpit details & progress calculation
7. Milestone inspection
8. Authoritative PayPal Sandbox order creation
9. Server-side PayPal capture & transaction verification
10. Immutable payment ledger recording
11. Gemini AI Progress Advisor query

---

## 🎬 Complete Hackathon Demonstration Scenario

Follow this walkthrough to experience the complete platform:

1. **Landing Page:** Navigate to `http://localhost:5173`. Notice the clean value proposition and hackathon sponsor highlights.
2. **Log In as Freelancer:** Click **"Freelancer"** in the top demo bar (or sign in as `alex@milestonemate.dev` / `password123`).
3. **Freelancer Dashboard:** Review portfolio metrics and the interactive AG Grid project table.
4. **Create a Project:** Click **"Create New Project"**, click **"Pre-fill Hackathon Demo Project"**, and submit.
5. **Gemini AI Generator:** Click **"Generate Milestones with Gemini AI"**. Inspect the generated tasks, budget distribution, and completion criteria. Edit any milestone inline, then click **"Save Milestones & Share with Client"**.
6. **Log In as Client:** Click **"Client"** in the top demo bar (or sign in as `sarah@company.com` / `password123`).
7. **Approve Roadmap:** Open the project and click **"Approve Milestone Plan"**.
8. **Deliverable Review & Approval:**
   - Look at **Milestone 2: UI/UX Storefront & Product Catalog** ($1,200).
   - Click **"Approve Deliverables"**. Notice the button instantly transforms into **"Pay Now with PayPal ($1,200)"**!
9. **PayPal Sandbox Checkout:**
   - Click **"Pay Now with PayPal"**.
   - Review the authoritative amount ($1,200 USD).
   - Complete checkout via the PayPal Sandbox Smart Button or the 1-Click Sandbox test button.
   - Enjoy the celebratory confetti as the verified capture ID is recorded!
10. **Payment Ledger:** Go to **"Payments"** in the sidebar to inspect the recorded PayPal transaction receipt in AG Grid.
11. **AI Progress Advisor:** Click **"Gemini AI Advisor"** in the project cockpit to view the AI-generated health assessment and recommendations.

---

## 🔒 Security Best Practices Implemented

- **Authoritative Amounts:** Milestone payment amounts are retrieved exclusively from MongoDB on the server; client-side request amounts are never trusted.
- **Idempotent Capture Handling:** Duplicate PayPal capture requests are rejected or safely return the existing receipt.
- **Separation of Secrets:** PayPal Client Secret and Gemini API Key are exclusively used in Node.js backend services and never exposed to the browser.
- **Strict Role Verification:** Freelancers cannot approve their own deliverables or initiate payments; Clients cannot modify project milestones.

---

## 📄 License
MIT License • Built with ❤️ for the PayPal & AI Hackathon.
