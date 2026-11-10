import React, { useState, useEffect } from 'react';
import { Sparkles, X, RefreshCw, Bot, ShieldAlert, ArrowRight } from 'lucide-react';
import { aiService } from '../services/aiService.js';

export default function AIAssistantModal({ isOpen, onClose, project, milestones }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [advice, setAdvice] = useState(null);
  const [delayAnalysis, setDelayAnalysis] = useState(null);

  useEffect(() => {
    if (isOpen && project?._id) {
      loadAIInsights();
    }
  }, [isOpen, project?._id]);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      const [sumRes, advRes, delayRes] = await Promise.all([
        aiService.getProgressSummary(project._id),
        aiService.getNextTaskAdvice(project._id),
        aiService.getDelayAnalysis(project._id),
      ]);
      setSummary(sumRes);
      setAdvice(advRes);
      setDelayAnalysis(delayRes);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2217]/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF6EC] rounded-2xl shadow-2xl border border-[#DCCFBA] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-[#0D2B1D] via-[#184230] to-[#0A2217] text-[#FAF6EC] flex items-center justify-between shrink-0 border-b border-[#2E6B4E]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2E6B4E]/40 rounded-lg">
              <Bot className="w-5 h-5 text-[#EB442C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black">Gemini AI Progress Advisor</h2>
                <span className="text-[10px] bg-[#FFEAE6] text-[#EB442C] px-2 py-0.5 rounded-full font-bold border border-[#FFD2CA]">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#A4B5AC]">Intelligent health analysis, next actions, and delay detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAIInsights}
              disabled={loading}
              className="p-1.5 rounded-lg text-[#A4B5AC] hover:text-[#FAF6EC] hover:bg-white/10 transition"
              title="Refresh Insights"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A4B5AC] hover:text-[#FAF6EC] hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#0D2B1D] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#0D2B1D]">Synthesizing project milestones with Gemini AI...</p>
              <p className="text-xs text-[#526058]">Analyzing deliverables, timelines, and payment readiness</p>
            </div>
          ) : (
            <>
              {/* Delay Analysis Banner */}
              {delayAnalysis?.isDelayed && (
                <div className="p-4 bg-[#FFEAE6] border border-[#FFD2CA] rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#EB442C] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-[#EB442C]">
                      Timeline Attention Needed ({delayAnalysis.overdueCount} Overdue Milestone)
                    </h4>
                    <p className="text-xs text-[#751307] mt-0.5 font-medium">
                      {delayAnalysis.overdueMilestones.map((m) => m.title).join(', ')} passed its target completion date. Consider reprioritizing.
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Summary Section */}
              <div className="p-4 bg-[#F5F0E6] border border-[#DCCFBA] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#0D2B1D] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#EB442C]" />
                  <span>Executive Progress Assessment</span>
                </div>
                <div className="text-xs text-[#283832] leading-relaxed whitespace-pre-line font-medium">
                  {summary || 'Generating project summary...'}
                </div>
              </div>

              {/* Next Step / Action Advice Card */}
              {advice && (
                <div className="p-4 bg-[#E0EFE6] border border-emerald-300 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0D2B1D] uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-[#0D2B1D]" /> Immediate Recommended Next Step
                    </span>
                    {advice.status && (
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-emerald-300 text-[#0D2B1D] rounded-full">
                        Status: {advice.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#0D2B1D] bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                    {advice.nextAction}
                  </p>

                  {advice.recommendations && advice.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-black text-[#0D2B1D] uppercase tracking-wider">
                        Strategic Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {advice.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-[#283832] flex items-start gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EB442C] mt-1.5 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-[#F5F0E6] rounded-xl border border-[#DCCFBA] text-center">
                  <span className="text-[11px] text-[#526058] font-bold block">Completion Rate</span>
                  <span className="text-lg font-black text-[#0D2B1D]">
                    {delayAnalysis?.completionRate ?? 0}%
                  </span>
                </div>
                <div className="p-3 bg-[#F5F0E6] rounded-xl border border-[#DCCFBA] text-center">
                  <span className="text-[11px] text-[#526058] font-bold block">Total Milestones</span>
                  <span className="text-lg font-black text-[#0D2B1D]">
                    {milestones?.length || 0}
                  </span>
                </div>
                <div className="p-3 bg-[#F5F0E6] rounded-xl border border-[#DCCFBA] text-center">
                  <span className="text-[11px] text-[#526058] font-bold block">Paid Milestones</span>
                  <span className="text-lg font-black text-[#0D2B1D]">
                    {milestones?.filter((m) => m.status === 'Paid').length || 0}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#EFE7D8] border-t border-[#DCCFBA] flex justify-between items-center text-xs text-[#526058] shrink-0 font-medium">
          <span>AI outputs advisory recommendations. All approvals remain client-controlled.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0D2B1D] hover:bg-[#184230] text-[#FAF6EC] font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
