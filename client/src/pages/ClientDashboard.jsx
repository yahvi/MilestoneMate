import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  DollarSign,
  Search,
  ShieldCheck,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { projectService } from '../services/projectService.js';
import { useAuth } from '../context/AuthContext.jsx';
import AGGridTable from '../components/AGGridTable.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
    const onFocus = () => loadProjects();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user?._id]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load client projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCommitted = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (p.totalPaidAmount || 0), 0);
  const activeProjects = projects.filter((p) => p.status === 'In Progress').length;

  const columnDefs = [
    {
      headerName: 'Project Name',
      field: 'title',
      flex: 2,
      cellRenderer: (params) => (
        <div className="font-bold text-[#1C2826] flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Freelancer',
      field: 'freelancerId.name',
      flex: 1.5,
      cellRenderer: (params) => (
        <span className="text-[#3D4C44] text-xs font-semibold">
          {params.value || params.data.freelancerId?.email}
        </span>
      ),
    },
    {
      headerName: 'Total Budget',
      field: 'totalBudget',
      flex: 1,
      cellRenderer: (params) => (
        <span className="font-bold text-[#1C2826]">${params.value?.toLocaleString()} {params.data.currency}</span>
      ),
    },
    {
      headerName: 'Milestones Paid',
      field: 'totalPaidAmount',
      flex: 1.2,
      cellRenderer: (params) => (
        <span className="font-bold text-[#047857]">${params.value || 0}</span>
      ),
    },
    {
      headerName: 'Progress',
      field: 'progressPercentage',
      flex: 1.5,
      cellRenderer: (params) => (
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 bg-[#EFE8DC] rounded-full h-2 overflow-hidden border border-[#E0D5C5]">
            <div
              className="bg-linear-to-r from-[#047857] to-[#E34234] h-full rounded-full transition-all"
              style={{ width: `${params.value || 0}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-[#047857] w-8">{params.value || 0}%</span>
        </div>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1.2,
      cellRenderer: (params) => {
        const val = params.value;
        const badgeClass =
          val === 'Rejected'
            ? 'bg-[#FFEAE6] text-[#E34234] border-[#FFC7BD]'
            : val === 'Planning' || val === 'Awaiting Client Approval'
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : 'bg-[#F0FAF4] text-[#047857] border-emerald-300';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
            {val}
          </span>
        );
      },
    },
    {
      headerName: 'Action',
      flex: 1.4,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const isPendingInvitation = !params.data.clientApprovedPlan && params.data.status !== 'Rejected';
        if (isPendingInvitation) {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate(`/projects/${params.data._id}`)}
                className="px-2.5 py-1 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg transition shadow-2xs"
              >
                Review
              </button>
              <button
                onClick={() => navigate(`/projects/${params.data._id}?action=reject`)}
                className="px-2.5 py-1 bg-[#FFEAE6] hover:bg-[#E34234] text-[#E34234] hover:text-white border border-[#FFC7BD] font-bold text-xs rounded-lg transition"
              >
                Reject
              </button>
            </div>
          );
        }

        if (params.data.status === 'Rejected') {
          return (
            <button
              onClick={() => navigate(`/projects/${params.data._id}`)}
              className="px-3 py-1 bg-[#F2ECE1] hover:bg-[#EADBCE] text-[#3D4C44] font-bold text-xs rounded-lg transition"
            >
              View Details
            </button>
          );
        }

        return (
          <button
            onClick={() => navigate(`/projects/${params.data._id}`)}
            className="px-3 py-1 bg-[#E34234] hover:bg-[#C82E18] text-white font-bold text-xs rounded-lg transition shadow-2xs"
          >
            Review &amp; Pay
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FAF7F2]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-[#1C2826] tracking-tight">Client Project Cockpit</h1>
          <p className="text-xs text-[#5A6860] mt-0.5">
            Welcome, {user?.name}. Inspect submitted deliverables, approve milestones, and release verified PayPal payments.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Active Contracts</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-[#047857]">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1C2826] mt-2">{projects.length}</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">{activeProjects} currently in progress</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Payments Released</span>
              <div className="p-2 bg-emerald-100 rounded-xl text-[#047857]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#047857] mt-2">${totalPaid.toLocaleString()}</p>
            <span className="text-[11px] text-[#047857] font-semibold mt-1 block">Verified PayPal Captures</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Total Budget</span>
              <div className="p-2 bg-[#FFEAE6] rounded-xl text-[#E34234]">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#E34234] mt-2">${totalCommitted.toLocaleString()}</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">Committed milestone funds</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Protection Model</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-[#047857]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#1C2826] mt-2">Stage-Gate Release</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">Pay only after deliverable approval</span>
          </div>
        </div>

        {/* AG Grid Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C2826]">Assigned Projects</h2>
              <span className="text-[10px] bg-[#F4EFE6] text-[#047857] px-2 py-0.5 rounded-full font-bold border border-[#EADBCE]">
                AG Grid Table
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7F8D85]" />
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={quickFilter}
                  onChange={(e) => setQuickFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#EADBCE] rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={loadProjects}
                disabled={loading}
                className="px-3 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs font-bold text-[#1C2826] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Refresh projects list"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#047857] ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#7F8D85] text-xs">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-[#EADBCE] text-center space-y-2">
              <FolderKanban className="w-10 h-10 text-[#C4B7A6] mx-auto" />
              <h3 className="text-sm font-bold text-[#1C2826]">No Projects Assigned</h3>
              <p className="text-xs text-[#5A6860]">
                When a freelancer invites your email ({user?.email}), the project will appear here.
              </p>
            </div>
          ) : (
            <AGGridTable
              rowData={projects}
              columnDefs={columnDefs}
              quickFilterText={quickFilter}
              onRowClicked={(e) => navigate(`/projects/${e.data._id}`)}
              height="380px"
            />
          )}
        </div>
      </main>
    </div>
  );
}
