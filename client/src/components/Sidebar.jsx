import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  CreditCard,
  User,
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
    <aside className="w-64 bg-[#F5F0E6] border-r border-[#E2D7C5] hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-[#E2D7C5] bg-[#EFE7D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0D2B1D] to-[#184230] text-[#FAF6EC] font-black flex items-center justify-center text-sm shadow-sm border border-[#2E6B4E]/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-[#0D2B1D] truncate">{user?.name}</h4>
            <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full capitalize ${
              isFreelancer ? 'text-[#0D2B1D] bg-[#E0EFE6]' : 'text-[#EB442C] bg-[#FFEAE6]'
            }`}>
              {user?.role} Mode
            </span>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1.5 flex-1">
        <p className="px-3 py-2 text-[10px] font-black text-[#6F7D75] uppercase tracking-wider">Navigation</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition ${
                isActive
                  ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-xs'
                  : 'text-[#0D2B1D] hover:text-[#EB442C] hover:bg-[#EFE7D8]'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sponsor badge footer in Warm Ivory, Emerald & Vermillion */}
      <div className="p-4 border-t border-[#E2D7C5] bg-[#EFE7D8]">
        <div className="text-[11px] text-[#526058] space-y-1.5">
          <p className="font-black text-[#0D2B1D]">Hackathon Tech Stack:</p>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="bg-[#FAF6EC] border border-[#DCCFBA] px-2 py-0.5 rounded-md font-black text-[#0D2B1D]">
              PayPal
            </span>
            <span className="bg-[#FAF6EC] border border-[#DCCFBA] px-2 py-0.5 rounded-md font-black text-[#EB442C]">
              Gemini AI
            </span>
            <span className="bg-[#FAF6EC] border border-[#DCCFBA] px-2 py-0.5 rounded-md font-black text-[#184230]">
              AG Grid
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
