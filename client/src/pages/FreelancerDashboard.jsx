import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  DollarSign,
  Sparkles,
  TrendingUp,
  Search,
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
        <div className="font-bold text-[#1C2826] flex items-center gap-2">
          <span>{params.value}</span>
          <span className="text-[10px] font-normal text-[#6A7870]">({params.data.category || 'Web'})</span>
        </div>
      ),
    },
    {
      headerName: 'Client',
      field: 'clientEmail',
      flex: 1.5,
      cellRenderer: (params) => (
        <span className="text-[#3D4C44] text-xs">{params.data.clientId?.name || params.value}</span>
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
        const colorClass =
          val === 'Completed'
            ? 'bg-emerald-50 text-[#047857] border-emerald-300'
            : val === 'In Progress'
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : val === 'Awaiting Client Approval'
            ? 'bg-[#FFEAE6] text-[#E34234] border-[#FFC7BD]'
            : 'bg-[#F2ECE1] text-[#3D4C44] border-[#EADBCE]';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${colorClass}`}>
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
          className="px-3 py-1 bg-[#F5EFE6] hover:bg-[#047857] hover:text-white text-[#047857] border border-[#EADBCE] font-bold text-xs rounded-lg transition"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FAF7F2]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1C2826] tracking-tight">Freelancer Dashboard</h1>
            <p className="text-xs text-[#5A6860] mt-0.5">
              Welcome back, {user?.name}. Manage milestones and receive verified PayPal payouts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/ai-generator"
              className="px-4 py-2.5 bg-[#FFEAE6] hover:bg-[#FFD9D2] text-[#E34234] border border-[#FFC7BD] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#E34234]" /> AI Generator
            </Link>
            <Link
              to="/projects/new"
              className="px-4 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-900/20"
            >
              <PlusCircle className="w-4 h-4" /> Create New Project
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Total Projects</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-[#047857]">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1C2826] mt-2">{totalProjects}</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">{activeProjects} currently in progress</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Verified Payouts</span>
              <div className="p-2 bg-emerald-100 rounded-xl text-[#047857]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#047857] mt-2">${totalEarned.toLocaleString()}</p>
            <span className="text-[11px] text-[#047857] font-semibold mt-1 block">Captured via PayPal</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Pipeline Value</span>
              <div className="p-2 bg-[#FFEAE6] rounded-xl text-[#E34234]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#E34234] mt-2">${totalPipeline.toLocaleString()}</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">Across all milestone contracts</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6860]">Completed Projects</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-[#047857]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1C2826] mt-2">{completedProjects}</p>
            <span className="text-[11px] text-[#6A7870] mt-1 block">100% milestones paid</span>
          </div>
        </div>

        {/* AG Grid Project Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C2826]">Project Portfolio</h2>
              <span className="text-[10px] bg-[#F4EFE6] text-[#047857] px-2 py-0.5 rounded-full font-bold border border-[#EADBCE]">
                Powered by AG Grid
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7F8D85]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#EADBCE] rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#7F8D85] text-xs">Loading projects from MongoDB...</div>
          ) : projects.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-[#EADBCE] text-center space-y-3">
              <FolderKanban className="w-10 h-10 text-[#C4B7A6] mx-auto" />
              <h3 className="text-sm font-bold text-[#1C2826]">No Projects Found</h3>
              <p className="text-xs text-[#5A6860] max-w-sm mx-auto">
                Create your first project or use the demo reset button in the navbar to populate sample projects.
              </p>
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#047857] text-white rounded-xl text-xs font-bold hover:bg-[#065F46]"
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
