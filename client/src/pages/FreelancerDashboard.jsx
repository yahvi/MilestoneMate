import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  ExternalLink,
} from 'lucide-react';
import { projectService } from '../services/projectService.js';
import { useAuth } from '../context/AuthContext.jsx';
import AGGridTable from '../components/AGGridTable.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function FreelancerDashboard() {
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
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute metrics from actual database data
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const totalEarned = projects.reduce((sum, p) => sum + (p.totalPaidAmount || 0), 0);
  const totalPipeline = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);

  // AG Grid Column Definitions
  const columnDefs = [
    {
      headerName: 'Project Name',
      field: 'title',
      flex: 2,
      cellRenderer: (params) => (
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <span>{params.value}</span>
          <span className="text-[10px] font-normal text-slate-400">({params.data.category || 'Web'})</span>
        </div>
      ),
    },
    {
      headerName: 'Client',
      field: 'clientEmail',
      flex: 1.5,
      cellRenderer: (params) => (
        <span className="text-slate-600 text-xs">{params.data.clientId?.name || params.value}</span>
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
      cellRenderer: (params) => {
        const val = params.value;
        const colorClass =
          val === 'Completed'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : val === 'In Progress'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : val === 'Awaiting Client Approval'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-slate-100 text-slate-700 border-slate-200';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colorClass}`}>
            {val}
          </span>
        );
      },
    },
    {
      headerName: 'Action',
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <button
          onClick={() => navigate(`/projects/${params.data._id}`)}
          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold text-xs rounded-lg transition"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Freelancer Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, {user?.name}. Manage milestones and receive verified PayPal payouts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/ai-generator"
              className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-violet-600" /> AI Generator
            </Link>
            <Link
              to="/projects/new"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Create New Project
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Projects</span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{totalProjects}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">{activeProjects} currently in progress</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Verified Payouts</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">${totalEarned.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Captured via PayPal</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pipeline Value</span>
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-700 mt-2">${totalPipeline.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Across all milestone contracts</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completed Projects</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{completedProjects}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">100% milestones paid</span>
          </div>
        </div>

        {/* AG Grid Project Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Project Portfolio</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                Powered by AG Grid
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading projects from MongoDB...</div>
          ) : projects.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <FolderKanban className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Projects Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first project or use the demo reset button in the navbar to populate sample projects.
              </p>
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
              >
                <PlusCircle className="w-4 h-4" /> Create Project
              </Link>
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
