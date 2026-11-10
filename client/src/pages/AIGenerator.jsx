import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
} from 'lucide-react';
import { aiService } from '../services/aiService.js';
import { projectService } from '../services/projectService.js';
import { milestoneService } from '../services/milestoneService.js';
import Sidebar from '../components/Sidebar.jsx';

export default function AIGenerator() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const navigate = useNavigate();

  // Project inputs
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(3000);
  const [category, setCategory] = useState('Web Development');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Generated milestones state
  const [milestones, setMilestones] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id) => {
    try {
      const data = await projectService.getProjectById(id);
      if (data?.project) {
        setProject(data.project);
        setTitle(data.project.title);
        setDescription(data.project.description);
        setBudget(data.project.totalBudget);
        setCategory(data.project.category || 'Web Development');
        if (data.project.startDate) setStartDate(new Date(data.project.startDate).toISOString().split('T')[0]);
        if (data.project.deadline) setDeadline(new Date(data.project.deadline).toISOString().split('T')[0]);
        setAdditionalRequirements(data.project.additionalRequirements || '');
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  const handleGenerate = async () => {
    setError('');
    if (!title || !description || !budget) {
      return setError('Please provide project title, description, and budget.');
    }

    setGenerating(true);
    try {
      const generated = await aiService.generateMilestones({
        title,
        description,
        budget: Number(budget),
        startDate,
        deadline,
        category,
        additionalRequirements,
      });

      // Format tasks to strings if needed
      const formatted = generated.map((m) => ({
        ...m,
        tasks: Array.isArray(m.tasks)
          ? m.tasks.map((t) => (typeof t === 'string' ? t : t.title))
          : [],
      }));

      setMilestones(formatted);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'AI generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  // Inline milestone edits
  const updateMilestoneField = (index, field, value) => {
    setMilestones((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTask = (mIdx) => {
    setMilestones((prev) => {
      const copy = [...prev];
      copy[mIdx].tasks = [...(copy[mIdx].tasks || []), 'New task'];
      return copy;
    });
  };

  const updateTask = (mIdx, tIdx, val) => {
    setMilestones((prev) => {
      const copy = [...prev];
      copy[mIdx].tasks[tIdx] = val;
      return copy;
    });
  };

  const deleteTask = (mIdx, tIdx) => {
    setMilestones((prev) => {
      const copy = [...prev];
      copy[mIdx].tasks = copy[mIdx].tasks.filter((_, i) => i !== tIdx);
      return copy;
    });
  };

  const removeMilestone = (mIdx) => {
    setMilestones((prev) => prev.filter((_, i) => i !== mIdx));
  };

  const addEmptyMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: `Milestone ${prev.length + 1}: Final Review & Delivery`,
        description: 'Final walkthrough, deliverables handover, and verification.',
        budget: 500,
        startDate,
        deadline,
        completionCriteria: 'Client signs off on completed project deliverables.',
        tasks: ['Deliver final assets', 'Conduct walkthrough demo'],
      },
    ]);
  };

  const totalAllocated = milestones.reduce((sum, m) => sum + (Number(m.budget) || 0), 0);
  const budgetDiff = Number(budget) - totalAllocated;

  // Save to DB and submit to client
  const handleSaveAndConfirm = async () => {
    if (!projectId) {
      return setError('Please create or select a project first to attach milestones.');
    }

    if (milestones.length === 0) {
      return setError('No milestones to save. Generate or add at least one milestone.');
    }

    setSaving(true);
    setError('');
    try {
      await milestoneService.saveBulkMilestones(projectId, milestones);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save milestones.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#FAF7F2]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#1C2826] tracking-tight">AI Milestone Generator</h1>
              <span className="text-[10px] bg-[#FFEAE6] text-[#E34234] font-bold px-2.5 py-0.5 rounded-full border border-[#FFC7BD]">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-[#5A6860] mt-0.5">
              Generate structured, realistic milestones, task roadmaps, and budget allocations using Google Gemini.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-[#FFEAE6] border border-[#FFC7BD] text-[#E34234] rounded-xl text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Parameters Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#EADBCE] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-3">
            <h3 className="text-xs font-bold text-[#1C2826] uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#047857]" /> Project Brief &amp; Parameters
            </h3>
            {project && (
              <span className="text-[11px] font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Connected: {project.title}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1C2826] mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern E-commerce Storefront"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1C2826] mb-1">Total Project Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C2826] mb-1">Project Description &amp; Scope</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe deliverables, features, design specifications, and integration requirements..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#6A7870]">
              Gemini will break this scope down into sequential milestones, tasks, and budgets.
            </span>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#E34234] hover:bg-[#C82E18] text-white font-bold rounded-xl text-xs shadow-md shadow-[#E34234]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" /> Generate Milestones with Gemini AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Milestones Section */}
        {milestones.length > 0 && (
          <div className="space-y-4">
            {/* Budget distribution balance banner */}
            <div className="p-4 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#1C2826]">Milestone Breakdown ({milestones.length})</h3>
                <p className="text-xs text-[#5A6860]">
                  Total Allocated: <span className="font-bold text-[#1C2826]">${totalAllocated}</span> of ${budget}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {budgetDiff === 0 ? (
                  <span className="text-xs font-bold text-[#047857] bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Budget Perfectly Balanced
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#E34234] bg-[#FFEAE6] border border-[#FFC7BD] px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Diff: ${budgetDiff}
                  </span>
                )}
                <button
                  onClick={addEmptyMilestone}
                  className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C2826] border border-[#EADBCE] rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              </div>
            </div>

            {/* Milestones Cards */}
            <div className="space-y-4">
              {milestones.map((m, mIdx) => (
                <div key={mIdx} className="p-5 bg-white rounded-2xl border border-[#EADBCE] shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE1] pb-3">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#047857] font-black text-xs flex items-center justify-center shrink-0">
                        {mIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => updateMilestoneField(mIdx, 'title', e.target.value)}
                        className="font-bold text-sm text-[#1C2826] bg-transparent border-b border-transparent hover:border-[#EADBCE] focus:border-emerald-600 outline-hidden w-full"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                        <span className="text-xs text-[#5A6860] font-bold">$</span>
                        <input
                          type="number"
                          value={m.budget}
                          onChange={(e) => updateMilestoneField(mIdx, 'budget', Number(e.target.value))}
                          className="w-16 text-xs font-bold text-[#1C2826] bg-transparent outline-hidden"
                        />
                      </div>
                      <button
                        onClick={() => removeMilestone(mIdx)}
                        className="p-1.5 text-[#8A9890] hover:text-[#E34234] rounded-lg hover:bg-red-50 transition"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A6860] block mb-0.5">Scope &amp; Description</label>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={(e) => updateMilestoneField(mIdx, 'description', e.target.value)}
                      className="w-full text-xs text-[#1C2826] bg-[#FAF7F2] p-2 rounded-xl border border-[#EADBCE] outline-hidden focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A6860] block mb-0.5">Completion Criteria</label>
                      <input
                        type="text"
                        value={m.completionCriteria || ''}
                        onChange={(e) => updateMilestoneField(mIdx, 'completionCriteria', e.target.value)}
                        placeholder="Criteria for client sign-off..."
                        className="w-full text-xs text-[#1C2826] bg-[#FAF7F2] p-2 rounded-xl border border-[#EADBCE] outline-hidden focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A6860] block mb-0.5">Start Date</label>
                        <input
                          type="date"
                          value={m.startDate ? m.startDate.split('T')[0] : startDate}
                          onChange={(e) => updateMilestoneField(mIdx, 'startDate', e.target.value)}
                          className="w-full text-xs text-[#1C2826] bg-[#FAF7F2] p-2 rounded-xl border border-[#EADBCE] outline-hidden font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A6860] block mb-0.5">Target Deadline</label>
                        <input
                          type="date"
                          value={m.deadline ? m.deadline.split('T')[0] : deadline}
                          onChange={(e) => updateMilestoneField(mIdx, 'deadline', e.target.value)}
                          className="w-full text-xs text-[#1C2826] bg-[#FAF7F2] p-2 rounded-xl border border-[#EADBCE] outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#5A6860] uppercase tracking-wider">
                        Actionable Tasks ({m.tasks?.length || 0})
                      </span>
                      <button
                        onClick={() => addTask(mIdx)}
                        className="text-[11px] text-[#047857] hover:text-[#065F46] font-bold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Task
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {m.tasks?.map((t, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                          <input
                            type="text"
                            value={t}
                            onChange={(e) => updateTask(mIdx, tIdx, e.target.value)}
                            className="flex-1 px-2.5 py-1 bg-[#FAF7F2] rounded-lg border border-[#EADBCE] outline-hidden focus:bg-white text-xs text-[#1C2826]"
                          />
                          <button
                            onClick={() => deleteTask(mIdx, tIdx)}
                            className="text-[#8A9890] hover:text-[#E34234] p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-white rounded-2xl border border-[#EADBCE] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#5A6860]">
                Saving will submit this milestone plan to the client for official approval.
              </div>
              <button
                onClick={handleSaveAndConfirm}
                disabled={saving || !projectId}
                className="w-full sm:w-auto px-6 py-3 bg-[#047857] hover:bg-[#065F46] text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving to Database...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Milestones &amp; Share with Client
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
