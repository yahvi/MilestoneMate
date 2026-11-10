import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Workflow,
  ArrowRight,
  Sparkles,
  CreditCard,
  FileCheck,
  Bot,
  Table,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  Layers,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'freelancer' | 'client'
  const [openFaq, setOpenFaq] = useState(null);
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleDemo = async (role) => {
    try {
      const loggedUser = await demoLogin(role);
      navigate(loggedUser?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch {
      try {
        await api.post('/seed');
        const loggedUser = await demoLogin(role);
        navigate(loggedUser?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
      } catch (err) {
        navigate('/login');
      }
    }
  };

  const steps = [
    {
      num: '01',
      title: 'AI Scoping & Balanced Budget Split',
      badge: 'Gemini 3.8 Flash',
      badgeBg: 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]',
      freelancerRole:
        'Freelancer provides project brief, deadline, and total budget. Gemini AI generates 4–6 milestones with balanced budgets and sub-tasks.',
      clientRole:
        'Client receives a mathematically sound project proposal with clear deadlines and deliverables—zero hidden scope.',
      engineNote:
        'Strict zero-sum reconciliation ensures sum of all milestone budgets matches the total contract budget.',
      color: 'text-[#0D2B1D]',
    },
    {
      num: '02',
      title: 'Mutual Roadmap Agreement & Lock',
      badge: 'State Machine Lock',
      badgeBg: 'bg-[#FAF6EC] text-[#0D2B1D] border-[#DCCFBA]',
      freelancerRole:
        'Freelancer reviews the generated milestones, fine-tunes task durations or budget weighting, and submits for client commitment.',
      clientRole:
        'Client inspects the deliverables and criteria, then approves the roadmap, locking the project into the In Progress state.',
      engineNote:
        'Backend sets clientApprovedPlan: true and unlocks Stage-Gate 1 for development.',
      color: 'text-[#184230]',
    },
    {
      num: '03',
      title: 'Milestone Execution & Proof Submission',
      badge: 'Deliverable Hub',
      badgeBg: 'bg-[#E0EFE6] text-[#2E6B4E] border-[#B7D8C4]',
      freelancerRole:
        'Freelancer checks off micro-tasks, attaches URLs (GitHub PRs, Figma, staging links), and submits with handover notes.',
      clientRole:
        'Client receives an instant notification with direct links to review and test the deliverables in sandbox or staging.',
      engineNote:
        'Milestone transitions to Submitted state; deliverables are locked to preserve inspection integrity.',
      color: 'text-[#2E6B4E]',
    },
    {
      num: '04',
      title: 'Stage-Gate Inspection & Verification',
      badge: 'Escrow Gate Lock',
      badgeBg: 'bg-[#FFEAE6] text-[#EB442C] border-[#FFD2CA]',
      freelancerRole:
        'Freelancer awaits client review or addresses itemized revision feedback with versioned resubmissions.',
      clientRole:
        'Client verifies deliverables against completion criteria. Two options: Approve (unlocks PayPal checkout) or Request Revision.',
      engineNote:
        'PayPal payment gateway is strictly locked on the server until client approval flag is verified.',
      color: 'text-[#EB442C]',
    },
    {
      num: '05',
      title: 'Authoritative PayPal Escrow Payout',
      badge: 'PayPal Orders V2',
      badgeBg: 'bg-[#751307] text-[#FAF6EC] border-[#751307]',
      freelancerRole:
        'Funds captured server-side into seller PayPal account; milestone marked Paid; next milestone begins.',
      clientRole:
        'Authorizes payment via PayPal Sandbox modal; receives an official transaction capture receipt and ledger record.',
      engineNote:
        'Express server verifies order integrity with PayPal API, captures funds, records transaction ID in DB.',
      color: 'text-[#751307]',
    },
  ];

  const faqs = [
    {
      q: 'How does Gemini AI guarantee milestone budgets match the total project budget?',
      a: 'MilestoneMate passes mathematical zero-sum constraints to Gemini 3.8 Flash. Before writing to the database, our Express server validates that sum(milestones.budget) === totalBudget. If any rounding occurs, the backend auto-balances the difference into the final milestone.',
    },
    {
      q: 'What happens if a client is dissatisfied with a submitted deliverable?',
      a: 'The client clicks "Request Revision" and writes itemized feedback. The milestone automatically reverts to "Revision Requested" on the freelancer\'s dashboard, and PayPal payout remains locked until the revision is reviewed and approved.',
    },
    {
      q: 'Can payment amounts be manipulated in the browser?',
      a: 'No. When initiating PayPal checkout, the frontend only sends the milestoneId. The backend looks up the authoritative budget from the database and constructs the PayPal Order directly with the PayPal REST API.',
    },
    {
      q: 'How do I test both Freelancer and Client flows during evaluation?',
      a: 'Use the 1-Click Demo buttons below or in the top navigation bar. Switch to Alex (Freelancer) to create and submit milestones, then switch to Sarah (Client) to inspect deliverables and execute PayPal sandbox payouts.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D2B1D] flex flex-col selection:bg-[#EB442C]/20 selection:text-[#0D2B1D]">
      {/* Top Hero Banner */}
      <section className="py-16 sm:py-20 bg-[#FAF6EC] border-b border-[#E2D7C5] risograph-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD2CA] text-xs font-black text-[#EB442C] uppercase tracking-widest mb-4 shadow-2xs">
            <Workflow className="w-4 h-4 text-[#EB442C]" /> The Stage-Gate Delivery Pipeline
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0D2B1D] tracking-tight max-w-4xl mx-auto">
            5 Steps from Project Kickoff to Paid Milestones
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#526058] max-w-3xl mx-auto leading-relaxed font-medium">
            A transparent, step-by-step protocol ensuring freelancers never work unpaid and clients never pay for
            unverified deliverables. Follow the complete lifecycle from AI scoping to PayPal settlement.
          </p>

          {/* Interactive Perspective Switcher */}
          <div className="mt-10 inline-flex items-center gap-1.5 p-1.5 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-2xs'
                  : 'text-[#526058] hover:text-[#0D2B1D]'
              }`}
            >
              Combined Pipeline
            </button>
            <button
              onClick={() => setActiveTab('freelancer')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'freelancer'
                  ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-2xs'
                  : 'text-[#526058] hover:text-[#0D2B1D]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#EB442C]" /> Freelancer Journey (Alex)
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#EB442C] text-white shadow-2xs'
                  : 'text-[#526058] hover:text-[#EB442C]'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Client Journey (Sarah)
            </button>
          </div>
        </div>
      </section>

      {/* 5-Step Pipeline Cards Section */}
      <section className="py-16 bg-[#F5F0E6] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-5">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] shadow-sm flex flex-col justify-between hover:border-[#0D2B1D] hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-3xl font-black ${s.color}`}>{s.num}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#0D2B1D] mb-3 leading-tight">{s.title}</h3>

                  {/* Dynamic View based on Active Tab */}
                  {(activeTab === 'all' || activeTab === 'freelancer') && (
                    <div className="mb-2.5 p-2.5 bg-[#F5F0E6] rounded-xl border border-[#DCCFBA]/60">
                      <p className="text-[10px] font-black text-[#0D2B1D] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D2B1D]" /> Freelancer Action:
                      </p>
                      <p className="text-xs text-[#526058] leading-relaxed">{s.freelancerRole}</p>
                    </div>
                  )}

                  {(activeTab === 'all' || activeTab === 'client') && (
                    <div className="mb-2.5 p-2.5 bg-[#FFEAE6]/40 rounded-xl border border-[#FFD2CA]/60">
                      <p className="text-[10px] font-black text-[#EB442C] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EB442C]" /> Client Action:
                      </p>
                      <p className="text-xs text-[#526058] leading-relaxed">{s.clientRole}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#DCCFBA]/60 text-[10px] text-[#6A7870] font-medium leading-normal flex items-start gap-1">
                  <span className="text-[#0D2B1D] font-black shrink-0">Backend Rule:</span>
                  <span>{s.engineNote}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Architecture Stack Banner */}
          <div className="mt-16 bg-[#FAF6EC] rounded-3xl p-6 sm:p-8 border border-[#DCCFBA] shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#EB442C] text-center mb-6">
              Platform Architecture Under The Hood
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-[#0D2B1D]">PayPal Orders V2</h4>
                <p className="text-[11px] text-[#526058] mt-0.5">Authoritative server-side order creation &amp; capture</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-[#0D2B1D]">Gemini 3.8 Flash</h4>
                <p className="text-[11px] text-[#526058] mt-0.5">High-speed project decomposition &amp; delay forecasting</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6EC] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2 border border-[#DCCFBA]">
                  <Table className="w-4 h-4 text-[#0D2B1D]" />
                </div>
                <h4 className="text-xs font-black text-[#0D2B1D]">AG Grid Community</h4>
                <p className="text-[11px] text-[#526058] mt-0.5">Enterprise tabular rendering with sorting &amp; custom badges</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#0D2B1D]" />
                </div>
                <h4 className="text-xs font-black text-[#0D2B1D]">Dual DB Engine</h4>
                <p className="text-[11px] text-[#526058] mt-0.5">MongoDB Atlas ready with seamless In-Memory fallback</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EB442C] block mb-1">
                Knowledge Base &amp; Protocol Rules
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B1D]">
                Frequently Answered Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] overflow-hidden transition shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-[#0D2B1D] text-xs sm:text-sm hover:text-[#EB442C] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#EB442C] shrink-0" />
                      {faq.q}
                    </span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#EB442C] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6A7870] shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-[#526058] leading-relaxed border-t border-[#DCCFBA]/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-[#FAF6EC] border-t border-[#E2D7C5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-[#F5F0E6] to-[#EFE7D8] border border-[#DCCFBA] shadow-lg">
            <span className="text-xs font-black uppercase tracking-widest text-[#EB442C] mb-2 block">
              Experience the Complete Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D2B1D] tracking-tight mb-4">
              Test Both Roles in Less Than 2 Minutes
            </h2>
            <p className="text-sm text-[#526058] max-w-xl mx-auto mb-8 font-medium">
              Create a project as Alex (Freelancer) and approve deliverables as Sarah (Client) using the PayPal Sandbox.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleDemo('freelancer')}
                className="px-8 py-3.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl shadow-md border border-[#0D2B1D] transition-all transform hover:-translate-y-0.5 text-sm flex items-center gap-2 cursor-pointer"
              >
                Log In as Freelancer <ArrowRight className="w-4 h-4 text-[#EB442C]" />
              </button>
              <button
                onClick={() => handleDemo('client')}
                className="px-8 py-3.5 bg-[#FAF6EC] hover:bg-white text-[#EB442C] font-black rounded-xl border-2 border-[#EB442C] shadow-xs transition-all transform hover:-translate-y-0.5 text-sm cursor-pointer"
              >
                Log In as Client
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer in Deep Ink Emerald */}
      <footer className="mt-auto bg-[#0A2217] text-[#DCE7E1] py-14 border-t border-[#123524] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#184230]/60">
            <div className="flex items-center gap-3 text-white font-black text-base">
              <div className="w-8 h-8 rounded-xl bg-[#0D2B1D] border border-[#2E6B4E] flex items-center justify-center text-white shadow-xs">
                <Layers className="w-4.5 h-4.5 text-[#EB442C]" />
              </div>
              <span>Milestone<span className="text-[#EB442C]">Mate</span></span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#A4B5AC]">
              <Link to="/features" className="hover:text-white transition">Features</Link>
              <Link to="/how-it-works" className="text-white transition">How It Works</Link>
              <Link to="/login" className="hover:text-[#EB442C] transition">Sign In</Link>
              <Link to="/register" className="hover:text-[#FAF6EC] transition">Register</Link>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#82998C] text-[11px]">
            <p>
              Built for the PayPal &amp; AI Global Hackathon • Powered by React, Vite, Node.js, Express, PayPal Orders REST API &amp; Google Gemini AI.
            </p>
            <p className="font-semibold text-[#A4B5AC]">
              Stage-Gate Escrow &amp; AI Scoping Protocol © 2026 MilestoneMate
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

