import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react';
import { paymentService } from '../services/paymentService.js';
import { useAuth } from '../context/AuthContext.jsx';
import AGGridTable from '../components/AGGridTable.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Payments() {
  const { user, isFreelancer } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getHistory();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCaptured = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const columnDefs = [
    {
      headerName: 'Project',
      field: 'projectId.title',
      flex: 1.8,
      cellRenderer: (params) => (
        <span className="font-semibold text-slate-900">{params.value || 'Project Contract'}</span>
      ),
    },
    {
      headerName: 'Milestone',
      field: 'milestoneId.title',
      flex: 2,
      cellRenderer: (params) => (
        <span className="text-slate-700 text-xs">{params.value || 'Milestone Deliverable'}</span>
      ),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      flex: 1.2,
      cellRenderer: (params) => (
        <span className="font-extrabold text-emerald-600">
          ${params.value?.toLocaleString()} {params.data.currency}
        </span>
      ),
    },
    {
      headerName: 'PayPal Capture ID',
      field: 'paypalCaptureId',
      flex: 2,
      cellRenderer: (params) => (
        <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
          {params.value || params.data.paypalOrderId}
        </span>
      ),
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      flex: 1.2,
      cellRenderer: (params) => (
        <span className="text-xs text-slate-500">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1.2,
      cellRenderer: (params) => {
        const val = params.value;
        const color =
          val === 'Paid'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : val === 'Payment Initiated'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-rose-50 text-rose-700 border-rose-200';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${color}`}>
            {val}
          </span>
        );
      },
    },
    {
      headerName: 'Details',
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <button
          onClick={() => setSelectedPayment(params.data)}
          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
        >
          Inspect
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Ledger & PayPal Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified PayPal Sandbox transactions for milestone completions.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">
              {isFreelancer ? 'Total Verified Earnings' : 'Total Payments Released'}
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-2">${totalCaptured.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Via PayPal Sandbox REST API</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
            <p className="text-2xl font-black text-slate-900 mt-2">{payments.length}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Recorded in MongoDB</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Protection Standard</span>
            <p className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5 text-indigo-700">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Server-Verified Captures
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Idempotent capture prevents double billing</span>
          </div>
        </div>

        {/* AG Grid Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                AG Grid Table
              </span>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading payment transactions...</div>
          ) : payments.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Transactions Yet</h3>
              <p className="text-xs text-slate-500">
                When milestones are approved and paid via PayPal, verified records will appear here.
              </p>
            </div>
          ) : (
            <AGGridTable
              rowData={payments}
              columnDefs={columnDefs}
              quickFilterText={quickFilter}
              onRowClicked={(e) => setSelectedPayment(e.data)}
              height="400px"
            />
          )}
        </div>
      </main>

      {/* Transaction Inspection Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">PayPal Transaction Receipt</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedPayment.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ${selectedPayment.amount} {selectedPayment.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone:</span>
                <span className="font-semibold text-slate-800">{selectedPayment.milestoneId?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payer:</span>
                <span className="text-slate-700">{selectedPayment.payerId?.name || selectedPayment.payerId?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payee:</span>
                <span className="text-slate-700">{selectedPayment.payeeId?.name || selectedPayment.payeeId?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PayPal Order ID:</span>
                <span className="font-mono text-slate-800">{selectedPayment.paypalOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PayPal Capture ID:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {selectedPayment.paypalCaptureId || 'SIM-COMPLETED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Captured At:</span>
                <span className="text-slate-700">
                  {selectedPayment.capturedAt
                    ? new Date(selectedPayment.capturedAt).toLocaleString()
                    : new Date(selectedPayment.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
