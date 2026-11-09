import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Layers,
  CheckCircle2,
  Table,
  Bot,
  Zap,
  Lock,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated, user, demoLogin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-linear-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-6 shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            <span>Built for PayPal & AI Hackathon • Powered by PayPal & Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Build Trust. Track Progress.{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-800">
              Get Paid Milestone by Milestone.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MilestoneMate divides complex freelance projects into structured stages. Gemini AI generates realistic tasks and budgets, clients inspect deliverables, and PayPal processes verified milestone payouts.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 text-sm"
              >
                Go to Your Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 text-sm"
                >
                  Start as Freelancer <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition text-sm"
                >
                  Client Sign In
                </Link>
              </>
            )}
          </div>

          {/* Instant Sandbox Evaluator Banner */}
          <div className="mt-12 max-w-xl mx-auto p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-md text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Hackathon Test Accounts
              </span>
              <span className="text-[11px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                1-Click Login
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Explore the full end-to-end workflow immediately without typing credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => demoLogin('freelancer')}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl font-medium text-slate-800 transition flex items-center justify-between text-left"
              >
                <div>
                  <p className="font-bold text-indigo-700">Alex (Freelancer)</p>
                  <p className="text-[10px] text-slate-500">Create & submit milestones</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => demoLogin('client')}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl font-medium text-slate-800 transition flex items-center justify-between text-left"
              >
                <div>
                  <p className="font-bold text-purple-700">Sarah (Client)</p>
                  <p className="text-[10px] text-slate-500">Approve & pay via PayPal</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars / Features */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Core Platform Features</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for transparency, protection, and frictionless payments
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Gemini AI Milestone Generator</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide a project description and budget. Gemini AI generates realistic milestone scopes, task breakdowns, deadlines, and budget allocations—fully editable before saving.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Verified PayPal Sandbox Payments</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backend-enforced PayPal Orders API. Amount is authoritative from MongoDB, never client-side. Payouts are captured server-side with verified transaction logs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Deliverable Inspection & Approvals</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Freelancers upload deliverables and notes. Clients review and either approve (unlocking PayPal checkout) or request structured revisions with inline feedback.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">AI Progress Advisor & Delay Flags</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic executive summaries, next recommended actions, and automatic flags for overdue tasks to keep projects strictly on track.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Table className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Interactive AG Grid Tables</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated AG Grid (hackathon sponsor) delivers high-performance sorting, filtering, and status badges across project portfolios and payment ledgers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Role-Based Security & Audit Log</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict separation between Freelancers and Clients. Every action is recorded in immutable Activity Logs and triggers in-app notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Workflow Walkthrough</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              5 Steps from Project Kickoff to Paid Milestones
            </h3>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'AI Scoping',
                desc: 'Freelancer inputs project scope & budget; Gemini AI breaks it down into structured milestones.',
              },
              {
                step: '02',
                title: 'Client Review',
                desc: 'Client reviews the proposed milestones, tasks, and budget allocations, then approves the roadmap.',
              },
              {
                step: '03',
                title: 'Work & Submit',
                desc: 'Freelancer tracks task progress and submits completed deliverables with verification notes.',
              },
              {
                step: '04',
                title: 'Client Approval',
                desc: 'Client inspects the deliverables. Once approved, the secure PayPal checkout button is unlocked.',
              },
              {
                step: '05',
                title: 'PayPal Capture',
                desc: 'PayPal processes payment. Server captures and records verified transaction ID in MongoDB.',
              },
            ].map((s, idx) => (
              <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs relative">
                <span className="text-2xl font-black text-indigo-100 block mb-2">{s.step}</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Layers className="w-5 h-5 text-indigo-400" /> MilestoneMate
          </div>
          <p className="text-center sm:text-left">
            Built for the PayPal & AI Hackathon • Built with React, Vite, Node.js, PayPal REST API & Gemini AI.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
