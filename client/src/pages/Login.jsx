import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      navigate(user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      navigate(user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo user not seeded yet. Click Reset in navbar first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6] risograph-texture">
      <div className="max-w-md w-full space-y-8 bg-[#FAF6EC] p-8 rounded-2xl shadow-xl border border-[#DCCFBA]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-[#0D2B1D] via-[#184230] to-[#0A2217] flex items-center justify-center text-white mx-auto shadow-md border border-[#2E6B4E]/30">
            <Layers className="w-6 h-6 text-[#EB442C]" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#0D2B1D] tracking-tight">Sign In to MilestoneMate</h2>
          <p className="mt-1 text-xs text-[#526058]">Track milestones, approve work, and process verified PayPal payouts.</p>
        </div>

        {error && (
          <div className="p-3 bg-[#FFEAE6] border border-[#FFD2CA] text-[#EB442C] rounded-xl text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast-Login Section */}
        <div className="p-3.5 bg-[#EFE7D8] border border-[#DCCFBA] rounded-xl space-y-2">
          <p className="text-[11px] font-black text-[#0D2B1D] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#EB442C]" /> Hackathon Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemo('freelancer')}
              className="py-2 px-3 bg-white hover:bg-[#0D2B1D] hover:text-[#FAF6EC] border border-[#DCCFBA] rounded-lg font-black text-[#0D2B1D] transition shadow-2xs"
            >
              Freelancer (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('client')}
              className="py-2 px-3 bg-white hover:bg-[#EB442C] hover:text-white border border-[#FFD2CA] rounded-lg font-black text-[#EB442C] transition shadow-2xs"
            >
              Client (Sarah)
            </button>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A8780]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A8780]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 border border-[#0D2B1D]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#526058]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#EB442C] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
