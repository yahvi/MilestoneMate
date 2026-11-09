import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Upload,
  MessageSquare,
  CreditCard,
  ShieldCheck,
  Check,
  RefreshCw,
  FileText,
  Send,
  HelpCircle,
} from 'lucide-react';
import { projectService } from '../services/projectService.js';
import { milestoneService } from '../services/milestoneService.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import PaymentModal from '../components/PaymentModal.jsx';
import AIAssistantModal from '../components/AIAssistantModal.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, isFreelancer, isClient } = useAuth();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [paymentMilestone, setPaymentMilestone] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Deliverable submission modal
  const [submitMilestoneModal, setSubmitMilestoneModal] = useState(null);
  const [deliverableName, setDeliverableName] = useState('Final Build & Repository');
  const [deliverableUrl, setDeliverableUrl] = useState('https://github.com/alex/ecommerce-demo');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Revision request modal
  const [revisionMilestoneModal, setRevisionMilestoneModal] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      const data = await projectService.getProjectById(id);
      setProjectData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const project = projectData?.project;
  const milestones = projectData?.milestones || [];
  const activities = projectData?.activities || [];

  // Client approves the overall project plan
  const handleApprovePlan = async () => {
    setActionLoading(true);
    try {
      await projectService.updateProject(id, { clientApprovedPlan: true });
      await loadProjectDetails();
    } catch (err) {
      alert('Failed to approve plan: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Freelancer toggles a task
  const handleToggleTask = async (milestone, taskIndex) => {
    if (!isFreelancer) return;
    const updatedTasks = [...milestone.tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;

    try {
      await milestoneService.updateMilestone(milestone._id, { tasks: updatedTasks });
      setProjectData((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m._id === milestone._id ? { ...m, tasks: updatedTasks } : m
        ),
      }));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Freelancer marks milestone In Progress
  const handleStartMilestone = async (milestoneId) => {
    try {
      await milestoneService.updateMilestone(milestoneId, { status: 'In Progress' });
      await loadProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Freelancer submits deliverables
  const handleConfirmSubmit = async () => {
    if (!submitMilestoneModal) return;
    try {
      await milestoneService.submitMilestone(submitMilestoneModal._id, {
        deliverables: [{ name: deliverableName, url: deliverableUrl, uploadedAt: new Date() }],
        submissionNotes,
      });
      setSubmitMilestoneModal(null);
      await loadProjectDetails();
    } catch (err) {
      alert('Failed to submit milestone: ' + err.message);
    }
  };

  // Client approves milestone
  const handleApproveMilestone = async (milestoneId) => {
    try {
      await milestoneService.approveMilestone(milestoneId, 'Deliverables verified and accepted.');
      await loadProjectDetails();
    } catch (err) {
      alert('Failed to approve milestone: ' + err.message);
    }
  };

  // Client requests revision
  const handleConfirmRevision = async () => {
    if (!revisionMilestoneModal || !revisionFeedback) return;
    try {
      await milestoneService.requestRevision(revisionMilestoneModal._id, revisionFeedback);
      setRevisionMilestoneModal(null);
      setRevisionFeedback('');
      await loadProjectDetails();
    } catch (err) {
      alert('Failed to request revision: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Submitted for Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Revision Requested':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Error Loading Project</h2>
          <p className="text-xs text-slate-500">{error || 'Project not found.'}</p>
          <button
            onClick={() => navigate('/dashboard/freelancer')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.status === 'Paid' || m.status === 'Approved').length;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Project Header Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                  {project.category || 'Web Development'}
                </span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{project.title}</h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">{project.description}</p>
            </div>

            {/* Quick Financial Overview & AI Advisor Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-right">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Budget</span>
                <span className="text-2xl font-black text-slate-900">
                  ${project.totalBudget?.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-500">{project.currency}</span>
                </span>
              </div>

              <button
                onClick={() => setAiModalOpen(true)}
                className="px-4 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-violet-200" />
                <span>Gemini AI Advisor</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Contract Parties */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <ProgressBar
                percentage={project.progressPercentage}
                totalMilestones={milestones.length}
                completedMilestones={completedCount}
                size="md"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FREELANCER</span>
                <span className="font-bold text-slate-800">{project.freelancerId?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">CLIENT</span>
                <span className="font-bold text-slate-800">{project.clientId?.name || project.clientEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Plan Approval Banner */}
        {!project.clientApprovedPlan && (
          <div className="p-5 bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-700/60 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Proposed Milestone Roadmap Awaiting Client Approval</h3>
                <p className="text-xs text-indigo-200">
                  {isClient
                    ? 'Review the proposed breakdown below. Approve the roadmap to authorize the freelancer to begin work.'
                    : 'The client must approve this milestone breakdown before work proceeds.'}
                </p>
              </div>
            </div>

            {isClient && (
              <button
                onClick={handleApprovePlan}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"
              >
                <Check className="w-4 h-4" /> Approve Milestone Plan
              </button>
            )}
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight">Project Milestones ({milestones.length})</h2>
            <span className="text-xs text-slate-500">Milestone-by-milestone inspection & verified payouts</span>
          </div>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={m._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition hover:border-slate-300"
              >
                {/* Milestone Bar */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusColor(m.status)}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-medium">Milestone Budget</span>
                      <span className="text-xl font-extrabold text-slate-900">
                        ${m.budget}{' '}
                        <span className="text-xs font-semibold text-slate-500">{project.currency}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  {m.tasks && m.tasks.length > 0 && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Tasks & Deliverable Criteria
                      </span>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {m.tasks.map((task, tIdx) => (
                          <div
                            key={tIdx}
                            onClick={() => handleToggleTask(m, tIdx)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs transition ${
                              isFreelancer ? 'cursor-pointer hover:bg-slate-100' : ''
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                                task.completed
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables / Submission Notes display */}
                  {m.deliverables && m.deliverables.length > 0 && (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1.5">
                      <span className="font-bold text-indigo-900 block">Submitted Deliverables:</span>
                      <div className="flex flex-wrap gap-2">
                        {m.deliverables.map((del, dIdx) => (
                          <a
                            key={dIdx}
                            href={del.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-2xs transition"
                          >
                            <ExternalLink className="w-3 h-3" /> {del.name}
                          </a>
                        ))}
                      </div>
                      {m.submissionNotes && (
                        <p className="text-slate-600 text-[11px] pt-1">
                          <span className="font-semibold text-slate-700">Notes:</span> {m.submissionNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Client Feedback display */}
                  {m.clientFeedback && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">Client Feedback:</span>
                      <p className="text-amber-800 text-[11px]">{m.clientFeedback}</p>
                    </div>
                  )}

                  {/* Verified PayPal Transaction Confirmation */}
                  {m.status === 'Paid' && m.paypalCaptureId && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-emerald-900">Verified PayPal Payment Completed</span>
                          <span className="text-[11px] text-emerald-700 block font-mono">
                            Capture ID: {m.paypalCaptureId}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg">
                        Paid ${m.budget} {project.currency}
                      </span>
                    </div>
                  )}

                  {/* Actions Bar per User Role */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Deadline: {m.deadline ? new Date(m.deadline).toLocaleDateString() : 'Flexible'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Freelancer actions */}
                      {isFreelancer && (
                        <>
                          {m.status === 'Pending' && (
                            <button
                              onClick={() => handleStartMilestone(m._id)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition"
                            >
                              Start Milestone
                            </button>
                          )}
                          {(m.status === 'In Progress' || m.status === 'Revision Requested') && (
                            <button
                              onClick={() => setSubmitMilestoneModal(m)}
                              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5" /> Submit Work for Review
                            </button>
                          )}
                        </>
                      )}

                      {/* Client actions */}
                      {isClient && (
                        <>
                          {m.status === 'Submitted for Review' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setRevisionMilestoneModal(m)}
                                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition"
                              >
                                Request Revisions
                              </button>
                              <button
                                onClick={() => handleApproveMilestone(m._id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve Deliverables
                              </button>
                            </div>
                          )}

                          {m.status === 'Approved' && (
                            <button
                              onClick={() => setPaymentMilestone(m)}
                              className="px-5 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 animate-pulse"
                            >
                              <CreditCard className="w-4 h-4" /> Pay Now with PayPal (${m.budget})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Activity Log Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Project Activity & Payment Audit Trail</h3>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400">No activity recorded yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{act.action}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{act.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Deliverable Submission Modal */}
      {submitMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Submit Deliverables for Review</h3>
            <p className="text-xs text-slate-500">Milestone: {submitMilestoneModal.title}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverable Title / Name</label>
                <input
                  type="text"
                  value={deliverableName}
                  onChange={(e) => setDeliverableName(e.target.value)}
                  placeholder="e.g. GitHub Repository, Staging Link, Design File"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deliverable URL / Asset Link</label>
                <input
                  type="url"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Notes for Client</label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Summary of completed tasks and instructions to inspect the work..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSubmitMilestoneModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Request Revisions</h3>
            <p className="text-xs text-slate-500">Milestone: {revisionMilestoneModal.title}</p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Revision Feedback</label>
              <textarea
                rows={4}
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                placeholder="Explain the required adjustments or missing criteria..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevisionMilestoneModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Payment Modal */}
      <PaymentModal
        isOpen={Boolean(paymentMilestone)}
        milestone={paymentMilestone}
        project={project}
        onClose={() => setPaymentMilestone(null)}
        onSuccess={() => {
          setPaymentMilestone(null);
          loadProjectDetails();
        }}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        project={project}
        milestones={milestones}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
