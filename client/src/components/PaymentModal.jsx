import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentService } from '../services/paymentService.js';

export default function PaymentModal({ isOpen, onClose, milestone, project, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !milestone) return null;

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Called by PayPal Buttons to create order server-side
  const handleCreateOrder = async () => {
    setError('');
    try {
      const res = await paymentService.createOrder(milestone._id);
      return res.orderId;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to initialize PayPal order';
      setError(msg);
      throw err;
    }
  };

  // Called by PayPal Buttons on approval to capture order server-side
  const handleApprove = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentService.captureOrder(data.orderID);
      setSuccessData(res.payment);
      triggerConfetti();
      if (onSuccess) onSuccess(res);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to capture PayPal payment';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // One-click Sandbox simulation for instant hackathon review
  const handleSimulatedPay = async () => {
    setLoading(true);
    setError('');
    try {
      const orderRes = await paymentService.createOrder(milestone._id);
      const captureRes = await paymentService.captureOrder(orderRes.orderId);
      setSuccessData(captureRes.payment);
      triggerConfetti();
      if (onSuccess) onSuccess(captureRes);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Simulated payment failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A221B]/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EADBCE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-[#064E3B] via-[#047857] to-[#0A221B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800/80 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">PayPal Milestone Payment</h2>
              <p className="text-xs text-emerald-100">Sandbox Environment • Verified Capture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Milestone Details Card */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EADBCE]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-bold text-[#047857] uppercase tracking-wider">
                  {project?.title || 'Project'}
                </span>
                <h3 className="text-sm font-bold text-[#1C2826] mt-0.5">{milestone.title}</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-[#047857] border border-emerald-300 text-xs font-bold rounded-full">
                {milestone.status}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-[#EADBCE] flex items-baseline justify-between">
              <span className="text-xs text-[#5A6860] font-semibold">Milestone Payment Amount:</span>
              <span className="text-2xl font-black text-[#047857]">
                ${milestone.budget} <span className="text-xs font-bold text-[#5A6860]">{project?.currency || 'USD'}</span>
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#FFEAE6] border border-[#FFC7BD] rounded-xl flex items-start gap-2.5 text-xs text-[#E34234] font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successData ? (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-[#047857] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#047857]">Payment Successfully Verified!</h4>
                <p className="text-xs text-[#065F46] mt-1 font-semibold">
                  ${successData.amount} {successData.currency} captured. Milestone status updated to Paid.
                </p>
                <div className="mt-2 text-[11px] font-mono text-[#047857] bg-white py-1 px-2.5 rounded-md border border-emerald-200 inline-block">
                  Capture ID: {successData.paypalCaptureId || 'COMPLETED'}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-lg transition"
              >
                Close &amp; View Updated Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#3D4C44] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EADBCE]">
                <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                <span>
                  Authoritative amount (${milestone.budget}) is enforced server-side directly from the database to prevent client tampering.
                </span>
              </div>

              {/* PayPal Smart Buttons */}
              <div className="min-h-[120px]">
                <PayPalScriptProvider options={{ clientId, currency: project?.currency || 'USD' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onError={(err) => setError('PayPal error: ' + (err.message || 'Payment window closed'))}
                  />
                </PayPalScriptProvider>
              </div>

              {/* Fast Sandbox Demo Button */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-[#EADBCE]"></div>
                <span className="shrink mx-3 text-[11px] font-bold text-[#8A9890]">OR FOR HACKATHON EVALUATION</span>
                <div className="grow border-t border-[#EADBCE]"></div>
              </div>

              <button
                onClick={handleSimulatedPay}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#E34234] hover:bg-[#C82E18] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-[#E34234]/25 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Capture on Server...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" /> 1-Click Sandbox Payment &amp; Verify
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
