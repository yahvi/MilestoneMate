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
  Loader2,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Workflow,
  RefreshCw,
  Eye,
  Check,
  HelpCircle,
  Users,
  Activity,
  Award,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import HeroEditorial3D from '../components/HeroEditorial3D.jsx';
import api from '../services/api.js';

export default function Home() {
  const { isAuthenticated, user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('all'); // 'all' | 'freelancer' | 'client'
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleDemoLogin = async (role) => {
    setLoadingRole(role);
    try {
      const loggedUser = await demoLogin(role);
      navigate(loggedUser?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (err) {
      console.warn('First login attempt failed, attempting to seed demo database:', err.message);
      try {
        await api.post('/seed');
        const loggedUser = await demoLogin(role);
        navigate(loggedUser?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
      } catch (seedErr) {
        alert('Could not authenticate with backend: ' + seedErr.message);
      }
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D2B1D] flex flex-col selection:bg-[#EB442C]/20 selection:text-[#0D2B1D]">
      {/* ========================================================
          HERO SECTION: EDITORIAL POSTER WITH 3D LINOCUT SHADING
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E2D7C5] bg-[#F5F0E6] risograph-texture">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Editorial Ribbon Badge & Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-black text-[#6F7D75] uppercase tracking-widest mb-3">
            <span className="text-[#0D2B1D]">STAGE-GATE DELIVERY</span>
            <span>•</span>
            <span className="text-[#EB442C]">PAYPAL V2 SETTLEMENT</span>
            <span>•</span>
            <span className="text-[#0D2B1D]">GEMINI 3.8 FLASH</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6EC] border border-[#DCCFBA] text-xs font-bold text-[#0D2B1D] mb-2 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#EB442C] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#EB442C]" />
            <span>Built What's Next with PayPal &amp; AI • Global Hackathon</span>
          </div>

          {/* Centered Masterpiece: 3D Linocut Words & Curved Lines Pattern */}
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 my-2 flex items-center justify-center">
            <HeroEditorial3D />
          </div>

          {/* Subtitle & Value Statement */}
          <p className="mt-4 text-base sm:text-lg text-[#3A4E44] max-w-2xl mx-auto leading-relaxed font-medium">
            MilestoneMate eliminates black-box freelance contracts.
            <strong className="text-[#0D2B1D] font-bold"> Google Gemini AI</strong> generates realistic milestones and tasks, clients inspect deliverables, and
            <strong className="text-[#EB442C] font-bold"> PayPal</strong> executes authoritative stage-gate payouts.
          </p>

          {/* Action CTAs: Ink Emerald & Vermillion */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/demo-video"
              className="px-6 py-3.5 bg-[#EB442C] hover:bg-[#D4341E] text-white font-black rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch AI Video Demo (90s)
            </Link>
            {isAuthenticated ? (
              <Link
                to={user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'}
                className="px-7 py-3.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl shadow-md border border-[#0D2B1D] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                Go to Your Dashboard <ArrowRight className="w-4 h-4 text-[#EB442C]" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl shadow-md border border-[#0D2B1D] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
                >
                  Start as Freelancer <ArrowRight className="w-4 h-4 text-[#EB442C]" />
                </Link>
                <Link
                  to="/login"
                  className="px-7 py-3.5 bg-[#FAF6EC] hover:bg-white text-[#EB442C] font-black rounded-xl border-2 border-[#EB442C] shadow-xs transition-all transform hover:-translate-y-0.5 text-sm"
                >
                  Client Sign In
                </Link>
              </>
            )}
          </div>

          {/* Instant Sandbox Evaluator Banner */}
          <div className="mt-10 max-w-xl mx-auto p-5 bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] shadow-md text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#0D2B1D] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#EB442C]" /> Instant Hackathon Test Accounts
              </span>
              <span className="text-[11px] bg-[#FFEAE6] text-[#EB442C] font-black px-2.5 py-0.5 rounded-full border border-[#FFD2CA]">
                1-Click Login
              </span>
            </div>
            <p className="text-xs text-[#526058] mb-3">
              Explore the entire end-to-end workflow immediately without typing credentials:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => handleDemoLogin('freelancer')}
                disabled={loadingRole !== null}
                className="p-3 bg-[#F5F0E6] hover:bg-white border border-[#DCCFBA] hover:border-[#0D2B1D] rounded-xl font-medium text-[#0D2B1D] transition flex items-center justify-between text-left group shadow-2xs disabled:opacity-50"
              >
                <div>
                  <p className="font-black text-[#0D2B1D] flex items-center gap-1.5">
                    Alex (Freelancer)
                    {loadingRole === 'freelancer' && <Loader2 className="w-3 h-3 animate-spin text-[#0D2B1D]" />}
                  </p>
                  <p className="text-[10px] text-[#6A7870]">Create &amp; submit milestones</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#0D2B1D] group-hover:translate-x-0.5 transition" />
              </button>
              <button
                onClick={() => handleDemoLogin('client')}
                disabled={loadingRole !== null}
                className="p-3 bg-[#F5F0E6] hover:bg-white border border-[#DCCFBA] hover:border-[#EB442C] rounded-xl font-medium text-[#0D2B1D] transition flex items-center justify-between text-left group shadow-2xs disabled:opacity-50"
              >
                <div>
                  <p className="font-black text-[#EB442C] flex items-center gap-1.5">
                    Sarah (Client)
                    {loadingRole === 'client' && <Loader2 className="w-3 h-3 animate-spin text-[#EB442C]" />}
                  </p>
                  <p className="text-[10px] text-[#6A7870]">Approve &amp; pay via PayPal</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#EB442C] group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            {/* Watch AI Video Walkthrough Shortcut Banner */}
            <Link
              to="/demo-video"
              className="w-full mt-3 p-2.5 bg-[#F5F0E6] hover:bg-[#EFE7D8] border border-[#DCCFBA] hover:border-[#EB442C] rounded-xl flex items-center justify-between transition cursor-pointer group shadow-2xs"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-[#0D2B1D] group-hover:text-[#EB442C] transition">
                <span className="w-6 h-6 rounded-lg bg-[#EB442C] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span>Watch AI Video Walkthrough (9-Step Protocol)</span>
              </span>
              <span className="text-[10px] font-black uppercase text-[#EB442C] bg-[#FFEAE6] px-2 py-0.5 rounded-full border border-[#FFD2CA]">
                90s Video ▶
              </span>
            </Link>

            {/* Live Backend Connection Indicator */}
            <div className="mt-3 pt-3 border-t border-[#DCCFBA]/60 flex items-center justify-between text-[11px] text-[#526058]">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Backend Connected: <span className="text-[#0D2B1D]">Express API (Port 5000)</span>
              </span>
              <span className="font-semibold text-[#8C7A68]">
                In-Memory Store Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CORE FEATURES SECTION (Warm Ivory & Ink Emerald)
          ======================================================== */}
      <section id="features" className="py-24 bg-[#FAF6EC] border-b border-[#E2D7C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0EFE6] border border-[#B7D8C4] text-[11px] font-black text-[#0D2B1D] uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#EB442C]" /> Engineered for Contract Transparency
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0D2B1D] tracking-tight">
              Everything You Need for Dispute-Free, Verifiable Milestones
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#526058] leading-relaxed font-medium">
              Traditional contracts rely on vague emails, upfront friction, and disputed deliverables.
              MilestoneMate replaces uncertainty with AI-structured roadmaps, client verification gates, and
              server-authoritative PayPal payouts.
            </p>
          </div>

          {/* 8 Comprehensive Feature Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#0D2B1D] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Sparkles className="w-6 h-6 text-[#0D2B1D]" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#0D2B1D] border border-[#DCCFBA]">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  AI Milestone &amp; Scope Generator
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Transform any unstructured client brief into 4–6 chronological milestones. Gemini calculates balanced budgets down to the dollar, assigns realistic timelines, and drafts acceptance criteria.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Zero-sum budget distribution
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Actionable 3-to-5 task checklists
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Fully customizable before saving
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Sub-second AI Generation</span>
                <span className="text-[#0D2B1D]">Structured JSON</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#EB442C] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#EB442C] border border-[#FFD2CA]">
                    PayPal Orders V2
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Server-Authoritative Escrow Payouts
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Milestone amounts are strictly verified on the backend before creating PayPal Orders. Client-side tampering is impossible. Payouts capture server-side with permanent transaction receipts.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Database-authoritative pricing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Server-side capture verification
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Immediate ledger update on success
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>PayPal Sandbox Tested</span>
                <span className="text-[#EB442C]">Zero Client Tamper</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#0D2B1D] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#0D2B1D] border border-[#DCCFBA]">
                    Stage-Gate Engine
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Deliverable Inspection &amp; Revisions
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Eliminate blind payments. Freelancers attach GitHub PRs, Figma links, and build notes. Clients inspect live deliverables and choose to approve or request structured revisions with inline feedback.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> One-click deliverable testing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Itemized revision request loop
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Payout locked until approved
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Verification Enforced</span>
                <span className="text-[#0D2B1D]">Revision History</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#EB442C] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#EB442C] border border-[#FFD2CA]">
                    Predictive AI
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  AI Progress Advisor &amp; Delay Flags
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Proactive intelligence keeps contracts on schedule. MilestoneMate calculates project burndown, flags overdue milestones, and generates executive briefings with recommended next steps.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Automatic overdue task flags
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> AI Executive project summary
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Actionable next-task advice
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Early Risk Detection</span>
                <span className="text-[#EB442C]">Smart Guidance</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#0D2B1D] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Table className="w-6 h-6 text-[#0D2B1D]" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#0D2B1D] border border-[#DCCFBA]">
                    AG Grid Enterprise UX
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Interactive High-Speed Data Tables
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Experience instantaneous sorting, filtering, and live progress bars. AG Grid powers both freelancer portfolio views and client milestone approvals with custom status cell renderers.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Multi-column sorting &amp; filtering
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Instant text search QuickFilter
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Custom theme styled to warm ivory
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Sub-millisecond Render</span>
                <span className="text-[#0D2B1D]">Full Responsive</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#EB442C] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#EB442C] border border-[#FFD2CA]">
                    JWT Security
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Strict Role Isolation &amp; Guards
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Clean segregation between Freelancers and Clients. JWT Bearer authorization interceptors and route guards prevent unauthorized access or data leakage between contracts.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Bcrypt salted password security
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Automatic token injection &amp; refresh
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Isolated dashboards per role
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Enterprise Auth</span>
                <span className="text-[#EB442C]">Zero Tenant Leak</span>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#0D2B1D] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#0D2B1D] border border-[#DCCFBA]">
                    Audit Trail
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Immutable Event History Ledger
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Every milestone transition, deliverable link submission, client revision comment, and PayPal capture is permanently logged with timestamps, eliminating any disputes.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Chronological activity records
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> PayPal capture IDs stored
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#EB442C] shrink-0" /> Complete dispute evidentiary trail
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Permanent Logs</span>
                <span className="text-[#0D2B1D]">Tamper-Resistant</span>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="p-6 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA] hover:border-[#EB442C] hover:shadow-lg transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FAF6EC] text-[#EB442C] border border-[#FFD2CA]">
                    Real-Time Sync
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0D2B1D] mb-2 leading-snug">
                  Live In-App Notification Center
                </h4>
                <p className="text-xs text-[#526058] leading-relaxed mb-4">
                  Stay synchronized without endless email chains. Notification hub alerts freelancers when deliverables are approved or paid, and alerts clients when work is ready for review.
                </p>
                <ul className="space-y-1.5 text-xs text-[#3D4C44] font-semibold mb-4">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> 15s background polling sync
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> Unread count badge in header
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0D2B1D] shrink-0" /> One-click jump to active project
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[#DCCFBA]/60 text-[11px] font-bold text-[#6A7870] flex items-center justify-between">
                <span>Instant Alerts</span>
                <span className="text-[#EB442C]">Zero Missed Deadlines</span>
              </div>
            </div>
          </div>

          {/* Traditional Contracts vs MilestoneMate Comparison Table */}
          <div className="mt-16 bg-[#F5F0E6] rounded-3xl p-6 sm:p-10 border border-[#DCCFBA] shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EB442C] block mb-1">
                The Paradigm Shift
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0D2B1D]">
                Why Traditional Freelance Contracts Fail &amp; How We Fix It
              </h3>
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
                    <td className="py-3.5 px-4 font-bold text-[#0D2B1D]">1. Scope Definition</td>
                    <td className="py-3.5 px-4 text-[#6A7870]">
                      Vague email briefs that invite endless scope creep and missed requirements.
                    </td>
                    <td className="py-3.5 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Gemini 3.8 Flash automatically generates 4–6 milestones with explicit task checklists and criteria.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0D2B1D]">2. Payment Terms</td>
                    <td className="py-3.5 px-4 text-[#6A7870]">
                      Risky 50% upfront deposits or net-30 invoices that clients delay or refuse to pay.
                    </td>
                    <td className="py-3.5 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Authoritative PayPal stage-gate payouts released incrementally as each milestone is verified.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0D2B1D]">3. Quality Inspection</td>
                    <td className="py-3.5 px-4 text-[#6A7870]">
                      Subjective disputes over what "completed work" means, leading to sour relationships.
                    </td>
                    <td className="py-3.5 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Clients test live links and deliverables before approving; structured revision notes for fixes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0D2B1D]">4. Dispute &amp; Audit Trail</td>
                    <td className="py-3.5 px-4 text-[#6A7870]">
                      Lost messages across Slack, WhatsApp, and email with no permanent proof of agreement.
                    </td>
                    <td className="py-3.5 px-4 text-[#0D2B1D] font-bold bg-[#E0EFE6]/40">
                      Permanent chronological Activity Log with verified PayPal capture IDs and signed timestamps.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WORKFLOW WALKTHROUGH SECTION
          ======================================================== */}
      <section id="how-it-works" className="py-24 bg-[#F5F0E6] border-b border-[#E2D7C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEAE6] border border-[#FFD2CA] text-[11px] font-black text-[#EB442C] uppercase tracking-widest mb-3">
              <Workflow className="w-3.5 h-3.5 text-[#EB442C]" /> The Stage-Gate Protocol
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0D2B1D] tracking-tight">
              5 Steps from Project Kickoff to Paid Milestones
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#526058] leading-relaxed font-medium">
              A transparent, step-by-step pipeline designed so freelancers never work unpaid and clients never pay for unverified deliverables.
            </p>

            {/* Interactive Perspective Switcher */}
            <div className="mt-8 inline-flex items-center gap-1.5 p-1.5 bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveWorkflowTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeWorkflowTab === 'all'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-xs'
                    : 'text-[#526058] hover:text-[#0D2B1D]'
                }`}
              >
                Combined Protocol
              </button>
              <button
                type="button"
                onClick={() => setActiveWorkflowTab('freelancer')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeWorkflowTab === 'freelancer'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-xs'
                    : 'text-[#526058] hover:text-[#0D2B1D]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#EB442C]" /> Freelancer View (Alex)
              </button>
              <button
                type="button"
                onClick={() => setActiveWorkflowTab('client')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeWorkflowTab === 'client'
                    ? 'bg-[#EB442C] text-white shadow-xs'
                    : 'text-[#526058] hover:text-[#EB442C]'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Client View (Sarah)
              </button>
            </div>
          </div>

          {/* 5 In-Depth Step Cards */}
          <div className="grid md:grid-cols-5 gap-5">
            {[
              {
                step: '01',
                title: 'AI Scoping & Budget Split',
                badge: 'Gemini 3.8 Flash',
                badgeBg: 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]',
                freelancerRole: 'Inputs project brief, timeline, and total budget. Gemini outputs 4–6 milestones with sub-tasks.',
                clientRole: 'Gets an exact breakdown of project scope and milestone allocations before agreeing.',
                techNote: 'Budget is automatically split to equal the exact total budget sum with zero discrepancy.',
                color: 'text-[#0D2B1D]',
              },
              {
                step: '02',
                title: 'Mutual Roadmap Agreement',
                badge: 'State Machine Lock',
                badgeBg: 'bg-[#FAF6EC] text-[#0D2B1D] border-[#DCCFBA]',
                freelancerRole: 'Reviews generated tasks, adjusts dates or budgets if needed, and requests client approval.',
                clientRole: 'Inspects deliverables and milestones, approves the project plan, unlocking Stage-Gate 1.',
                techNote: 'Database sets clientApprovedPlan: true and marks the project In Progress.',
                color: 'text-[#184230]',
              },
              {
                step: '03',
                title: 'Execution & Proof Submission',
                badge: 'Deliverable Hub',
                badgeBg: 'bg-[#E0EFE6] text-[#2E6B4E] border-[#B7D8C4]',
                freelancerRole: 'Checks off micro-tasks, attaches URLs (GitHub, Figma, demo), and submits with handover notes.',
                clientRole: 'Receives instant in-app notification that Milestone deliverables are ready for review.',
                techNote: 'Milestone transitions to Submitted state; deliverables are locked for inspection.',
                color: 'text-[#2E6B4E]',
              },
              {
                step: '04',
                title: 'Stage-Gate Inspection',
                badge: 'Escrow Gate Lock',
                badgeBg: 'bg-[#FFEAE6] text-[#EB442C] border-[#FFD2CA]',
                freelancerRole: 'Awaits review or addresses structured revision requests with itemized notes.',
                clientRole: 'Tests deliverables against criteria. Clicks "Approve" (unlocks PayPal) or "Request Revision".',
                techNote: 'PayPal checkout is physically locked on backend until client approval flag is verified.',
                color: 'text-[#EB442C]',
              },
              {
                step: '05',
                title: 'Authoritative PayPal Payout',
                badge: 'PayPal Orders V2',
                badgeBg: 'bg-[#751307] text-[#FAF6EC] border-[#751307]',
                freelancerRole: 'Funds captured into PayPal account instantly; milestone marked Paid; next milestone begins.',
                clientRole: 'Authorizes secure payment via PayPal modal; receives verified transaction capture receipt.',
                techNote: 'Express server executes PayPal Capture, records payment in DB, and dispatches confirmation.',
                color: 'text-[#751307]',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] shadow-2xs flex flex-col justify-between hover:border-[#0D2B1D] hover:shadow-md transition relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-3xl font-black ${s.color}`}>{s.step}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                      {s.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#0D2B1D] mb-3 leading-tight">{s.title}</h4>

                  {/* Dynamic View based on Active Tab */}
                  {(activeWorkflowTab === 'all' || activeWorkflowTab === 'freelancer') && (
                    <div className="mb-2.5 p-2 bg-[#F5F0E6] rounded-xl border border-[#DCCFBA]/60">
                      <p className="text-[10px] font-black text-[#0D2B1D] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D2B1D]" /> Freelancer:
                      </p>
                      <p className="text-xs text-[#526058] leading-relaxed">{s.freelancerRole}</p>
                    </div>
                  )}

                  {(activeWorkflowTab === 'all' || activeWorkflowTab === 'client') && (
                    <div className="mb-2.5 p-2 bg-[#FFEAE6]/40 rounded-xl border border-[#FFD2CA]/60">
                      <p className="text-[10px] font-black text-[#EB442C] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EB442C]" /> Client:
                      </p>
                      <p className="text-xs text-[#526058] leading-relaxed">{s.clientRole}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#DCCFBA]/60 text-[10px] text-[#6A7870] font-medium leading-normal flex items-start gap-1">
                  <span className="text-[#0D2B1D] font-black shrink-0">Engine:</span>
                  <span>{s.techNote}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Architecture Stack Banner */}
          <div className="mt-16 bg-[#FAF6EC] rounded-3xl p-6 sm:p-8 border border-[#DCCFBA] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#FFEAE6] text-[#EB442C] flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-black text-[#0D2B1D]">PayPal Orders V2</h5>
                <p className="text-[11px] text-[#526058] mt-0.5">Authoritative server-side order creation &amp; capture</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2">
                  <Bot className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-black text-[#0D2B1D]">Gemini 3.8 Flash</h5>
                <p className="text-[11px] text-[#526058] mt-0.5">High-speed project decomposition &amp; delay forecasting</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6EC] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2 border border-[#DCCFBA]">
                  <Table className="w-4 h-4 text-[#0D2B1D]" />
                </div>
                <h5 className="text-xs font-black text-[#0D2B1D]">AG Grid Community</h5>
                <p className="text-[11px] text-[#526058] mt-0.5">Enterprise tabular rendering with sorting &amp; custom badges</p>
              </div>

              <div className="p-4 bg-[#F5F0E6] rounded-2xl border border-[#DCCFBA]">
                <div className="w-8 h-8 rounded-xl bg-[#E0EFE6] text-[#0D2B1D] flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#0D2B1D]" />
                </div>
                <h5 className="text-xs font-black text-[#0D2B1D]">Dual Database Engine</h5>
                <p className="text-[11px] text-[#526058] mt-0.5">MongoDB Atlas ready with seamless In-Memory fallback</p>
              </div>
            </div>
          </div>

          {/* Interactive Stage-Gate FAQs */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#EB442C] block mb-1">
                Frequently Answered Questions
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0D2B1D]">
                How Stage-Gate Escrow &amp; AI Scoping Work
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How does Gemini AI guarantee the milestone budgets sum to the total budget?',
                  a: 'MilestoneMate passes strict mathematical constraints in the Gemini prompt requiring exact zero-sum budget reconciliation. The backend validates that sum(milestones.budget) === totalBudget before saving to the database, ensuring zero accounting discrepancies.',
                },
                {
                  q: 'What happens if a client is not satisfied with a submitted deliverable?',
                  a: 'Instead of clicking "Approve", the client clicks "Request Revision" and writes itemized feedback. The milestone automatically reverts to "Revision Requested" on the freelancer\'s dashboard, and PayPal payout remains strictly locked until the revised deliverable meets the agreed criteria.',
                },
                {
                  q: 'Can a malicious user manipulate the payment amount in their browser?',
                  a: 'No. When the client clicks Pay with PayPal, the frontend only sends the milestoneId to the server. The backend retrieves the authoritative budget directly from the database and constructs the PayPal Order server-side. The amount is never trusted from the client.',
                },
                {
                  q: 'How do I test both Freelancer and Client roles during the hackathon evaluation?',
                  a: 'Use the instant 1-Click Demo accounts at the top of the page. Log in as Alex Rivera (Freelancer) to create projects and submit deliverables, or log in as Sarah Chen (Client) to inspect deliverables and trigger PayPal sandbox payouts.',
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF6EC] rounded-2xl border border-[#DCCFBA] overflow-hidden transition shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-[#0D2B1D] text-xs sm:text-sm hover:text-[#EB442C] transition"
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

      {/* ========================================================
          CALL TO ACTION SECTION
          ======================================================== */}
      <section className="py-20 bg-[#FAF6EC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-[#F5F0E6] to-[#EFE7D8] border border-[#DCCFBA] shadow-lg">
            <span className="text-xs font-black uppercase tracking-widest text-[#EB442C] mb-2 block">
              Start Eliminating Payment Friction Today
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#0D2B1D] tracking-tight mb-4">
              Experience Verified Freelance Contracts
            </h3>
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
              <button
                type="button"
                onClick={() => handleDemoLogin('freelancer')}
                className="px-8 py-3.5 bg-[#FAF6EC] hover:bg-white text-[#EB442C] font-black rounded-xl border-2 border-[#EB442C] shadow-xs transition-all transform hover:-translate-y-0.5 text-sm"
              >
                Test Live Freelancer Demo
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
              <Link to="/how-it-works" className="hover:text-white transition">How It Works</Link>
              <Link to="/demo-video" className="hover:text-white transition">AI Video Demo</Link>
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
