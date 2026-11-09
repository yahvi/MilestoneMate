import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle, Clock, AlertTriangle, ArrowRight, RefreshCw, Bot, ShieldAlert } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600/50 rounded-lg">
              <Bot className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Gemini AI Progress Advisor</h2>
                <span className="text-[10px] bg-violet-400/20 text-violet-200 px-2 py-0.5 rounded-full font-medium border border-violet-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-indigo-200">Intelligent health analysis, next actions, and delay detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAIInsights}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Refresh Insights"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-700">Synthesizing project milestones with Gemini AI...</p>
              <p className="text-xs text-slate-400">Analyzing deliverables, timelines, and payment readiness</p>
            </div>
          ) : (
            <>
              {/* Delay Analysis Banner */}
              {delayAnalysis?.isDelayed && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Timeline Attention Needed ({delayAnalysis.overdueCount} Overdue Milestone)
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {delayAnalysis.overdueMilestones.map((m) => m.title).join(', ')} passed its target completion date. Consider reprioritizing.
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Summary Section */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Executive Progress Assessment</span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {summary || 'Generating project summary...'}
                </div>
              </div>

              {/* Next Step / Action Advice Card */}
              {advice && (
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" /> Immediate Recommended Next Step
                    </span>
                    {advice.status && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded-full">
                        Status: {advice.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-900 bg-white p-3 rounded-lg border border-indigo-100/70 shadow-2xs">
                    {advice.nextAction}
                  </p>

                  {advice.recommendations && advice.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Strategic Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {advice.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Completion Rate</span>
                  <span className="text-lg font-bold text-slate-900">
                    {delayAnalysis?.completionRate ?? 0}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Total Milestones</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {milestones?.length || 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">Paid Milestones</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {milestones?.filter((m) => m.status === 'Paid').length || 0}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>AI outputs advisory recommendations. All approvals remain client-controlled.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
