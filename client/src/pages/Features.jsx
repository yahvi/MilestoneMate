import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Table,
  Bot,
  Zap,
  Lock,
  ChevronRight,
  FileCheck,
  CreditCard,
  ShieldCheck,
  Activity,
  Check,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function Features() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { isAuthenticated, user, demoLogin } = useAuth();
  const navigate = useNavigate();

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

  const features = [
    {
      id: 'ai-milestone',
      category: 'ai',
      icon: <Sparkles className="w-6 h-6 text-[#0D2B1D]" />,
      iconBg: 'bg-[#E0EFE6]',
      tag: 'Gemini 3.8 Flash',
      title: 'AI Milestone & Scope Generator',
      desc: 'Transforms any unstructured client brief into 4–6 chronological milestones. Gemini calculates balanced budgets down to the exact dollar, assigns realistic timelines, and drafts objective acceptance criteria.',
      bullets: [
        'Zero-sum budget distribution strictly reconciling to total project budget',
        'Actionable 3-to-5 task checklist automatically scoped per milestone',
        'Completely editable and fine-tunable before saving to the database',
      ],
      engine: 'Gemini 3.8 Flash • Sub-second AI Generation',
    },
    {
      id: 'paypal-escrow',
      category: 'escrow',
      icon: <CreditCard className="w-6 h-6 text-[#EB442C]" />,
      iconBg: 'bg-[#FFEAE6]',
      tag: 'PayPal Orders V2',
      title: 'Server-Authoritative Escrow Payouts',
      desc: 'Milestone amounts are strictly validated from backend database records before creating PayPal Orders. Client-side price tampering is physically impossible. Payouts capture server-side with verified transaction logs.',
      bullets: [
        'Database-enforced pricing (amount is never trusted from browser)',
        'Server-side PayPal capture verification and state synchronization',
        'Instant immutable ledger receipts stored in activity history',
      ],
      engine: 'PayPal REST Orders API v2 • Sandbox Escrow Verified',
    },
    {
      id: 'stage-gate',
      category: 'inspection',
      icon: <FileCheck className="w-6 h-6 text-[#0D2B1D]" />,
      iconBg: 'bg-[#E0EFE6]',
      tag: 'Stage-Gate Engine',
      title: 'Deliverable Inspection & Revision Loops',
      desc: 'Eliminate blind payments and scope arguments. Freelancers upload deliverables (live URLs, GitHub PRs, Figma links) and build notes. Clients inspect live deliverables and choose to approve or request revisions.',
      bullets: [
        'One-click deliverable testing and asset URL validation',
        'Itemized revision request workflow with inline feedback comments',
        'PayPal payment button strictly locked until client formally approves',
      ],
      engine: 'State Machine • Stage-Gate Verification Protocol',
    },
    {
      id: 'ai-advisor',
      category: 'ai',
      icon: <Bot className="w-6 h-6 text-[#EB442C]" />,
      iconBg: 'bg-[#FFEAE6]',
      tag: 'Predictive AI',
      title: 'AI Progress Advisor & Delay Flags',
      desc: 'Proactive intelligence keeps contracts on schedule. MilestoneMate calculates project burndown velocity, flags overdue milestones, and generates executive briefings with recommended next steps.',
      bullets: [
        'Automatic overdue task flags and schedule risk warnings',
        'Executive project progress summaries for stakeholder alignment',
        'Actionable recommended next tasks for freelancers',
      ],
      engine: 'Gemini AI Advisor • Proactive Risk Scoring',
    },
    {
      id: 'ag-grid',
      category: 'security',
      icon: <Table className="w-6 h-6 text-[#0D2B1D]" />,
      iconBg: 'bg-[#FAF6EC] border border-[#DCCFBA]',
      tag: 'AG Grid Enterprise UX',
      title: 'Interactive High-Speed Data Tables',
      desc: 'Experience instantaneous sorting, filtering, and live progress bars. AG Grid powers both freelancer portfolio views and client milestone approvals with custom status cell renderers.',
      bullets: [
        'Multi-column sorting, column resizing, and custom QuickFilter',
        'Custom status cell renderers styled to warm ivory & emerald',
        'High-performance rendering with responsive mobile scrolling',
      ],
      engine: 'AG-Grid Community v31+ • Sub-millisecond Render',
    },
    {
      id: 'jwt-security',
      category: 'security',
      icon: <Lock className="w-6 h-6 text-[#EB442C]" />,
      iconBg: 'bg-[#FFEAE6]',
      tag: 'JWT Security',
      title: 'Strict Role Isolation & Route Guards',
      desc: 'Clean segregation between Freelancers and Clients. JWT Bearer authorization interceptors and route guards prevent unauthorized access or data leakage between contracts.',
      bullets: [
        'Bcrypt salted password encryption (cost factor 10)',
        'Automatic Axios authorization header injection and cleanup',
        'Segregated dashboards tailored specifically to user role',
      ],
      engine: 'JWT Bearer • Bcrypt Hashing • Route Guards',
    },
    {
      id: 'audit-trail',
      category: 'escrow',
      icon: <ShieldCheck className="w-6 h-6 text-[#0D2B1D]" />,
      iconBg: 'bg-[#E0EFE6]',
      tag: 'Audit Trail',
      title: 'Immutable Activity History Ledger',
      desc: 'Every milestone transition, deliverable link submission, client revision comment, and PayPal capture is permanently logged with timestamps, eliminating disputes.',
      bullets: [
        'Chronological activity records with user signatures and timestamps',
        'PayPal Order IDs and Capture IDs stored permanently in the ledger',
        'Authoritative dispute-resolution evidentiary proof',
      ],
      engine: 'Permanent Event Stream • Immutable Log',
    },
    {
      id: 'notifications',
      category: 'inspection',
      icon: <Activity className="w-6 h-6 text-[#EB442C]" />,
      iconBg: 'bg-[#FFEAE6]',
      tag: 'Real-Time Sync',
      title: 'Live In-App Notification Center',
      desc: 'Stay synchronized without endless email chains. Notification hub alerts freelancers when deliverables are approved or paid, and alerts clients when work is ready for review.',
      bullets: [
        '15-second background polling with instant header badge count',
        'One-click mark all as read and unread counter',
        'Direct deep links jumping to active project milestones',
      ],
      engine: 'In-App Alert Hub • Background Polling Sync',
    },
  ];

  const filteredFeatures =
    activeCategory === 'all'
      ? features
      : features.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D2B1D] flex flex-col selection:bg-[#EB442C]/20 selection:text-[#0D2B1D]">
      {/* Top Hero Banner */}
      <section className="py-16 sm:py-20 bg-[#FAF6EC] border-b border-[#E2D7C5] risograph-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0EFE6] border border-[#B7D8C4] text-xs font-black text-[#0D2B1D] uppercase tracking-widest mb-4 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#EB442C]" /> 8 Core Platform Pillars • PayPal V2 + Gemini AI
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0D2B1D] tracking-tight max-w-4xl mx-auto">
            Everything You Need for Dispute-Free, Verifiable Milestones
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#526058] max-w-3xl mx-auto leading-relaxed font-medium">
            Traditional freelance contracts suffer from fuzzy deliverables, scope creep, and payment anxieties.
            MilestoneMate replaces uncertainty with AI-backed work scopes, deliverable inspection, and
            server-authoritative PayPal stage-gate payouts.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleDemo('freelancer')}
              className="px-7 py-3.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl shadow-md border border-[#0D2B1D] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm cursor-pointer"
            >
              Test Freelancer Experience <ArrowRight className="w-4 h-4 text-[#EB442C]" />
            </button>
            <button
              onClick={() => handleDemo('client')}
              className="px-7 py-3.5 bg-[#FAF6EC] hover:bg-white text-[#EB442C] font-black rounded-xl border-2 border-[#EB442C] shadow-xs transition-all transform hover:-translate-y-0.5 text-sm cursor-pointer"
            >
              Test Client Experience
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Pills & Feature Grid */}
      <section className="py-16 bg-[#F5F0E6] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: 'all', label: 'All Capabilities (8)' },
              { id: 'ai', label: 'AI & Automation (2)' },
              { id: 'escrow', label: 'PayPal & Escrow (2)' },
              { id: 'inspection', label: 'Inspection & Gates (2)' },
              { id: 'security', label: 'Security & AG Grid (2)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-xs'
                    : 'bg-[#FAF6EC] text-[#526058] hover:text-[#0D2B1D] border border-[#DCCFBA]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeatures.map((f) => (
              <div
                key={f.id}
                className="p-6 bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] hover:border-[#0D2B1D] hover:shadow-lg transition flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F5F0E6] border border-[#DCCFBA] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    {f.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#F5F0E6] text-[#0D2B1D] border border-[#DCCFBA]">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#526058] leading-relaxed mb-4">
                    {f.desc}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#3D4C44] font-medium mb-4">
                    {f.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                  <span>Engine:</span>
                  <span className="text-[#0D2B1D]">{f.engine}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Matrix: Traditional Contracts vs MilestoneMate */}
          <div className="mt-20 bg-[#FAF6EC] rounded-3xl p-6 sm:p-10 border border-[#DCCFBA] shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EB442C] block mb-1">
                The Paradigm Shift
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0D2B1D]">
                Why Traditional Freelance Contracts Fail &amp; How We Fix It
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCCFBA] text-[11px] uppercase tracking-wider text-[#6A7870]">
                    <th className="py-3 px-4 font-black">Contract Dimension</th>
                    <th className="py-3 px-4 font-black text-[#A83220]">Traditional Freelance (The Problem)</th>
                    <th className="py-3 px-4 font-black text-[#0D2B1D] bg-[#E0EFE6]/60 rounded-t-xl">
                      MilestoneMate (The Solution)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCCFBA]/60 font-medium">
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#0D2B1D]">1. Scope Definition</td>
                    <td className="py-4 px-4 text-[#6A7870]">
                      Vague email briefs that invite endless scope creep and missed requirements.
                    </td>
                    <td className="py-4 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Gemini 3.8 Flash automatically generates 4–6 milestones with explicit task checklists and criteria.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#0D2B1D]">2. Payment Terms</td>
                    <td className="py-4 px-4 text-[#6A7870]">
                      Risky 50% upfront deposits or net-30 invoices that clients delay or refuse to pay.
                    </td>
                    <td className="py-4 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Authoritative PayPal stage-gate payouts released incrementally as each milestone is verified.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#0D2B1D]">3. Quality Inspection</td>
                    <td className="py-4 px-4 text-[#6A7870]">
                      Subjective disputes over what "completed work" means, leading to sour relationships.
                    </td>
                    <td className="py-4 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Clients test live links and deliverables before approving; structured revision notes for fixes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-[#0D2B1D]">4. Dispute &amp; Audit Trail</td>
                    <td className="py-4 px-4 text-[#6A7870]">
                      Lost messages across Slack, WhatsApp, and email with no permanent proof of agreement.
                    </td>
                    <td className="py-4 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Permanent chronological Activity Log with verified PayPal capture IDs and signed timestamps.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-[#FAF6EC] border-t border-[#E2D7C5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-[#F5F0E6] to-[#EFE7D8] border border-[#DCCFBA] shadow-lg">
            <span className="text-xs font-black uppercase tracking-widest text-[#EB442C] mb-2 block">
              Start Eliminating Payment Friction Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D2B1D] tracking-tight mb-4">
              Ready to See Stage-Gate Milestones in Action?
            </h2>
            <p className="text-sm text-[#526058] max-w-xl mx-auto mb-8 font-medium">
              Join freelancers and clients who build trust milestone by milestone with Google Gemini AI and PayPal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl shadow-md border border-[#0D2B1D] transition-all transform hover:-translate-y-0.5 text-sm flex items-center gap-2"
              >
                Create Free Account <ArrowRight className="w-4 h-4 text-[#EB442C]" />
              </Link>
              <Link
                to="/how-it-works"
                className="px-8 py-3.5 bg-[#FAF6EC] hover:bg-white text-[#EB442C] font-black rounded-xl border-2 border-[#EB442C] shadow-xs transition-all transform hover:-translate-y-0.5 text-sm"
              >
                Explore the 5-Step Workflow
              </Link>
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
              <Link to="/features" className="text-white transition">Features</Link>
              <Link to="/how-it-works" className="hover:text-white transition">How It Works</Link>
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

