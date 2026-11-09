import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  AlertCircle,
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
  }, []);

  const loadProjects = async () => {
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
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: 'Freelancer',
      field: 'freelancerId.name',
      flex: 1.5,
      cellRenderer: (params) => (
        <span className="text-slate-700 text-xs font-medium">
          {params.value || params.data.freelancerId?.email}
        </span>
      ),
    },
    {
      headerName: 'Total Budget',
      field: 'totalBudget',
      flex: 1,
      cellRenderer: (params) => (
        <span className="font-bold text-slate-900">${params.value?.toLocaleString()} {params.data.currency}</span>
      ),
    },
    {
      headerName: 'Milestones Paid',
      field: 'totalPaidAmount',
      flex: 1.2,
      cellRenderer: (params) => (
        <span className="font-bold text-emerald-600">${params.value || 0}</span>
      ),
    },
    {
      headerName: 'Progress',
      field: 'progressPercentage',
      flex: 1.5,
      cellRenderer: (params) => (
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${params.value || 0}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-indigo-700 w-8">{params.value || 0}%</span>
        </div>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1.2,
      cellRenderer: (params) => (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Action',
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <button
          onClick={() => navigate(`/projects/${params.data._id}`)}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
        >
          Review & Pay
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Project Cockpit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome, {user?.name}. Inspect submitted deliverables, approve milestones, and release verified PayPal payments.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Contracts</span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{projects.length}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">{activeProjects} currently in progress</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Payments Released</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">${totalPaid.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Verified PayPal Captures</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Budget</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">${totalCommitted.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Committed milestone funds</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Protection Model</span>
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-2">Stage-Gate Release</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Pay only after deliverable approval</span>
          </div>
        </div>

        {/* AG Grid Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Assigned Projects</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                AG Grid Table
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter projects..."
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Projects Assigned</h3>
              <p className="text-xs text-slate-500">
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
