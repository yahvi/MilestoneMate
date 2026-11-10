import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import Sidebar from '../components/Sidebar.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [paypalEmail, setPaypalEmail] = useState(user?.paypalEmail || user?.email || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const updated = await authService.updateProfile({ name, title, bio, paypalEmail });
      setUser(updated);
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setStatusMsg({ type: '', text: '' });
    try {
      await authService.updatePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setStatusMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed.' });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F5F0E6]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D2B1D] tracking-tight">Profile &amp; Account Settings</h1>
          <p className="text-xs text-[#526058] mt-0.5">
            Manage your personal profile, PayPal sandbox settlement details, and security.
          </p>
        </div>

        {statusMsg.text && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-bold ${
              statusMsg.type === 'success'
                ? 'bg-[#E0EFE6] border-emerald-300 text-[#0D2B1D]'
                : 'bg-[#FFEAE6] border-[#FFD2CA] text-[#EB442C]'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0D2B1D]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EB442C]" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <form onSubmit={handleUpdateProfile} className="bg-[#FAF6EC] p-6 sm:p-8 rounded-2xl border border-[#DCCFBA] shadow-2xs space-y-5">
          <div className="flex items-center gap-4 border-b border-[#E2D7C5] pb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#0D2B1D] text-[#FAF6EC] font-black text-lg flex items-center justify-center shadow-sm border border-[#2E6B4E]/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-black text-[#0D2B1D]">{user?.name}</h2>
              <span className="text-xs text-[#526058]">{user?.email}</span>
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  user?.role === 'freelancer' ? 'bg-[#E0EFE6] text-[#0D2B1D]' : 'bg-[#FFEAE6] text-[#EB442C]'
                }`}>
                  {user?.role} Account
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">PayPal Account Email (For Milestone Settlement)</label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="seller-sandbox@paypal.com"
              className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Bio / Profile Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden leading-relaxed font-medium"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50 border border-[#0D2B1D]"
            >
              <Save className="w-4 h-4 text-[#EB442C]" /> Save Profile
            </button>
          </div>
        </form>

        {/* Change Password Card */}
        <form onSubmit={handleUpdatePassword} className="bg-[#FAF6EC] p-6 sm:p-8 rounded-2xl border border-[#DCCFBA] shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-[#0D2B1D]">Change Security Password</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0D2B1D] mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl text-xs focus:ring-2 focus:ring-emerald-800 focus:bg-white outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#FAF6EC] hover:bg-[#EFE7D8] text-[#0D2B1D] font-black rounded-xl text-xs border border-[#DCCFBA] transition shadow-2xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
