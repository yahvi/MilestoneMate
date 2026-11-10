import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import api, { checkBackendHealth } from '../services/api.js';

export default function Navbar() {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false, details: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const verifyBackend = async () => {
    const res = await checkBackendHealth();
    if (res.ok) {
      setBackendStatus({
        checked: true,
        online: true,
        details: `Backend API is healthy (Port 5000) • ${res.data.aiEnabled ? 'Gemini AI Ready' : 'AI Mode Active'}`,
      });
    } else {
      setBackendStatus({
        checked: true,
        online: false,
        details: `Could not reach backend API: ${res.error}`,
      });
    }
  };

  useEffect(() => {
    verifyBackend();
    const timer = setInterval(verifyBackend, 20000);
    return () => clearInterval(timer);
  }, []);

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
      await handleSeed();
      await demoLogin(role);
      navigate(role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#F5F0E6]/95 backdrop-blur-md border-b border-[#E2D7C5] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#0D2B1D] via-[#184230] to-[#0A2217] flex items-center justify-center text-white shadow-md shadow-emerald-950/25 group-hover:scale-105 transition border border-[#2E6B4E]/30">
                <Layers className="w-5 h-5 text-[#EB442C]" />
              </div>
              <div>
                <span className="text-lg font-black text-[#0D2B1D] tracking-tight">
                  Milestone<span className="text-[#EB442C]">Mate</span>
                </span>
                <span className="block text-[10px] text-[#526058] -mt-1 font-bold">
                  PayPal × Gemini AI
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#0D2B1D]">
              <Link
                to="/features"
                className={`py-1.5 px-3 rounded-xl transition font-bold ${
                  location.pathname === '/features'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-2xs'
                    : 'text-[#0D2B1D] hover:text-[#EB442C] hover:bg-[#EFE7D8]'
                }`}
              >
                Features
              </Link>

              <Link
                to="/how-it-works"
                className={`py-1.5 px-3 rounded-xl transition font-bold ${
                  location.pathname === '/how-it-works'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-2xs'
                    : 'text-[#0D2B1D] hover:text-[#EB442C] hover:bg-[#EFE7D8]'
                }`}
              >
                How It Works
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to={user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'}
                    className="hover:text-[#EB442C] transition py-1.5 px-2.5"
                  >
                    Dashboard
                  </Link>
                  <Link to="/payments" className="hover:text-[#EB442C] transition py-1.5 px-2.5">
                    Payments
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Quick Navigation Buttons */}
            <div className="flex md:hidden items-center gap-1 text-[11px] font-black">
              <Link
                to="/demo-video"
                className={`px-2 py-1 rounded-lg border font-black flex items-center gap-1 shadow-2xs ${
                  location.pathname === '/demo-video'
                    ? 'bg-[#EB442C] text-white border-[#EB442C]'
                    : 'bg-[#FFEAE6] text-[#EB442C] border-[#FFD2CA]'
                }`}
                title="Watch AI Video Demo"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Video</span>
              </Link>
              <Link
                to="/features"
                className={`px-2 py-1 rounded-lg border transition shadow-2xs ${
                  location.pathname === '/features'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] border-[#0D2B1D]'
                    : 'bg-[#FAF6EC] text-[#0D2B1D] border-[#DCCFBA] hover:text-[#EB442C]'
                }`}
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                className={`px-2 py-1 rounded-lg border transition shadow-2xs ${
                  location.pathname === '/how-it-works'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] border-[#0D2B1D]'
                    : 'bg-[#FAF6EC] text-[#0D2B1D] border-[#DCCFBA] hover:text-[#EB442C]'
                }`}
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Backend API Connection Status Pill */}
            <button
              onClick={verifyBackend}
              type="button"
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border transition cursor-pointer shadow-2xs ${
                backendStatus.online
                  ? 'bg-[#E0EFE6] border-[#B7D8C4] text-[#0D2B1D] hover:bg-[#D3EBDC]'
                  : 'bg-[#FFEAE6] border-[#FFD2CA] text-[#EB442C] hover:bg-[#FFDCD6]'
              }`}
              title={backendStatus.details || 'Click to verify backend connection'}
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-600 animate-pulse' : 'bg-[#EB442C]'}`} />
              <span>{backendStatus.online ? 'Backend :5000' : 'API Offline'}</span>
            </button>

            {/* Hackathon Demo Switcher Pill with AI Video Link */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#EFE7D8] p-1 rounded-xl border border-[#DCCFBA] text-xs font-bold shrink-0">
              <Link
                to="/demo-video"
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition font-black shadow-xs ${
                  location.pathname === '/demo-video'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC]'
                    : 'bg-[#EB442C] hover:bg-[#D4341E] text-white'
                }`}
                title="Open AI Video Walkthrough Page"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>AI Video Demo</span>
              </Link>
              <span className="w-px h-4 bg-[#DCCFBA] mx-0.5" />
              <span className="px-1 text-[#526058] text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#EB442C]" /> Demo:
              </span>
              <button
                onClick={() => handleDemoSwitch('freelancer')}
                className={`px-2.5 py-1 rounded-lg transition font-black cursor-pointer ${
                  user?.email === 'alex@milestonemate.dev'
                    ? 'bg-[#0D2B1D] text-[#FAF6EC] shadow-xs'
                    : 'bg-[#FAF6EC] text-[#0D2B1D] hover:text-[#EB442C]'
                }`}
                title="Log in as Alex Rivera (Freelancer)"
              >
                Freelancer
              </button>
              <button
                onClick={() => handleDemoSwitch('client')}
                className={`px-2.5 py-1 rounded-lg transition font-black cursor-pointer ${
                  user?.email === 'sarah@company.com'
                    ? 'bg-[#EB442C] text-white shadow-xs'
                    : 'bg-[#FAF6EC] text-[#0D2B1D] hover:text-[#EB442C]'
                }`}
                title="Log in as Sarah Chen (Client)"
              >
                Client
              </button>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-2 py-1 bg-[#DCCFBA] text-[#0D2B1D] hover:bg-[#D0C2AB] rounded-lg transition text-[11px] font-bold cursor-pointer"
                title="Reset or seed demo data in database"
              >
                {seeding ? 'Seeding...' : 'Reset'}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#EFE7D8] transition border border-transparent hover:border-[#DCCFBA]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0D2B1D] text-[#FAF6EC] flex items-center justify-center font-black text-xs uppercase shadow-xs">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left text-xs">
                      <p className="font-bold text-[#0D2B1D] leading-tight">{user.name}</p>
                      <span className="text-[10px] text-[#526058] capitalize font-semibold">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#526058]" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#FAF6EC] rounded-xl shadow-xl border border-[#DCCFBA] py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-[#EFE7D8] bg-[#F5F0E6]">
                        <p className="text-xs font-black text-[#0D2B1D]">{user.name}</p>
                        <p className="text-[11px] text-[#526058] truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-black rounded-md ${
                          user.role === 'freelancer' ? 'bg-[#E0EFE6] text-[#0D2B1D]' : 'bg-[#FFEAE6] text-[#EB442C]'
                        }`}>
                          {user.role === 'freelancer' ? 'Freelancer Account' : 'Client Account'}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="px-3.5 py-2 text-xs text-[#0D2B1D] hover:bg-[#F5F0E6] hover:text-[#EB442C] flex items-center gap-2 font-bold"
                      >
                        <User className="w-4 h-4 text-[#526058]" /> Profile &amp; Settings
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-[#EB442C] hover:bg-[#FFEAE6] flex items-center gap-2 font-black"
                      >
                        <LogOut className="w-4 h-4 text-[#EB442C]" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#0D2B1D] hover:text-[#EB442C] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-black text-[#FAF6EC] bg-[#0D2B1D] hover:bg-[#184230] rounded-xl transition shadow-xs border border-[#0D2B1D]"
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
