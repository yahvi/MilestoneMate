import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  CreditCard,
  User,
  FolderKanban,
  CheckSquare,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user, isFreelancer } = useAuth();

  const freelancerNav = [
    { name: 'Dashboard', path: '/dashboard/freelancer', icon: LayoutDashboard },
    { name: 'Create Project', path: '/projects/new', icon: PlusCircle },
    { name: 'AI Generator', path: '/ai-generator', icon: Sparkles },
    { name: 'Payments & History', path: '/payments', icon: CreditCard },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  const clientNav = [
    { name: 'Client Dashboard', path: '/dashboard/client', icon: LayoutDashboard },
    { name: 'Payment History', path: '/payments', icon: CreditCard },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  const navItems = isFreelancer ? freelancerNav : clientNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name}</h4>
            <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
              {user?.role} Mode
            </span>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sponsor badge footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="text-[11px] text-slate-500 space-y-1.5">
          <p className="font-semibold text-slate-700">Hackathon Sponsors:</p>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-indigo-700">
              PayPal
            </span>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-violet-700">
              Gemini AI
            </span>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-emerald-700">
              AG Grid
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
