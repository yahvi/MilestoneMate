import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const [title, setTitle] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        title,
        paypalEmail: paypalEmail || email,
      });
      navigate(user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6] risograph-texture">
      <div className="max-w-md w-full space-y-6 bg-[#FAF6EC] p-8 rounded-2xl shadow-xl border border-[#DCCFBA]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-[#0D2B1D] via-[#184230] to-[#0A2217] flex items-center justify-center text-white mx-auto shadow-md border border-[#2E6B4E]/30">
            <Layers className="w-6 h-6 text-[#EB442C]" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#0D2B1D] tracking-tight">Create Your Account</h2>
          <p className="mt-1 text-xs text-[#526058]">Join MilestoneMate to collaborate and process milestones.</p>
        </div>

        {error && (
          <div className="p-3 bg-[#FFEAE6] border border-[#FFD2CA] text-[#EB442C] rounded-xl text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1.5">I want to register as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 ${
                  role === 'freelancer'
                    ? 'border-[#0D2B1D] bg-[#0D2B1D] text-[#FAF6EC] shadow-2xs'
                    : 'border-[#DCCFBA] bg-[#F5F0E6] text-[#0D2B1D] hover:bg-white'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-2 ${
                  role === 'client'
                    ? 'border-[#EB442C] bg-[#EB442C] text-white shadow-2xs'
                    : 'border-[#DCCFBA] bg-[#F5F0E6] text-[#0D2B1D] hover:bg-white'
                }`}
              >
                <User className="w-4 h-4" /> Client
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Professional Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={role === 'freelancer' ? 'Full Stack & AI Engineer' : 'Product Lead'}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden transition font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2 border border-[#0D2B1D]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#526058]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#EB442C] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
