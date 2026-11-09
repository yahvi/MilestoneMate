import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  Database,
  ArrowRight,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import api from '../services/api.js';

export default function Navbar() {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await api.post('/seed');
      alert('Demo data initialized! You can now log in as Alex (Freelancer) or Sarah (Client).');
      window.location.reload();
    } catch (err) {
      alert('Error seeding demo data: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDemoSwitch = async (role) => {
    try {
      await demoLogin(role);
      navigate(role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (err) {
      // If user doesn't exist yet, seed first
      await handleSeed();
      await demoLogin(role);
      navigate(role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">Milestone<span className="text-indigo-600">Mate</span></span>
                <span className="block text-[10px] text-slate-500 -mt-1 font-medium">PayPal × Gemini AI</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/#features" className="hover:text-indigo-600 transition">Features</Link>
              <Link to="/#how-it-works" className="hover:text-indigo-600 transition">How It Works</Link>
              {isAuthenticated && (
                <>
                  <Link
                    to={user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'}
                    className="hover:text-indigo-600 transition"
                  >
                    Dashboard
                  </Link>
                  <Link to="/payments" className="hover:text-indigo-600 transition">
                    Payments
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Hackathon Demo Switcher Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <span className="px-2 text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> Demo Accounts:
              </span>
              <button
                onClick={() => handleDemoSwitch('freelancer')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  user?.email === 'alex@milestonemate.dev'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-indigo-600'
                }`}
                title="Log in as Alex Rivera (Freelancer)"
              >
                Freelancer
              </button>
              <button
                onClick={() => handleDemoSwitch('client')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  user?.email === 'sarah@company.com'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-indigo-600'
                }`}
                title="Log in as Sarah Chen (Client)"
              >
                Client
              </button>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-2 py-1 bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition text-[11px]"
                title="Reset or seed demo data in database"
              >
                {seeding ? 'Seeding...' : 'Reset Data'}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left text-xs">
                      <p className="font-semibold text-slate-800 leading-tight">{user.name}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded-md">
                          {user.role === 'freelancer' ? 'Freelancer Account' : 'Client Account'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Profile & Settings
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
