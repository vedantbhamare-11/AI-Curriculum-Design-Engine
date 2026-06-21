"use JSX";
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Layers, Eye, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Assignment {
  _id: string;
  subject: string;
  className: string;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

interface RecentAssignmentsProps {
  assignments: Assignment[];
}

export function RecentAssignments({ assignments }: RecentAssignmentsProps) {
  const router = useRouter();

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"><CheckCircle className="h-3 w-3 stroke-[2.2]" /> Ready</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"><Loader2 className="h-3 w-3 animate-spin" /> Generation</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-red-50 text-red-600 border border-red-100 shadow-sm"><AlertCircle className="h-3 w-3 stroke-[2.2]" /> Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 shadow-sm"><Clock className="h-3 w-3 stroke-[2.2]" /> Queue</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600 stroke-[2.2]" /> Recent Creation Pipelines
        </h3>
      </div>

      {/* 📱 HORIZONTAL SCROLL LAYER SAFEGUARD: Prevents grid stretching layout leaks on thin display screens */}
      <div className="w-full overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse min-w-150 sm:min-w-0">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-5">Subject Details</th>
              <th className="py-3 px-4 sm:px-5">Target Grade</th>
              <th className="py-3 px-4 sm:px-5">Max Weight</th>
              <th className="py-3 px-4 sm:px-5">Execution Status</th>
              <th className="py-3 px-4 sm:px-5">Dispatched Date</th>
              <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold text-slate-600">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-400">
                  No active assessment creation logs found in history profiles.
                </td>
              </tr>
            ) : (
              assignments.slice(0, 5).map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 sm:py-4 px-4 sm:px-5 font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.subject}
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-5 text-slate-500 font-bold">{item.className}</td>
                  <td className="py-3 sm:py-4 px-4 sm:px-5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 border border-slate-200/40 rounded-md text-[11px] sm:text-xs font-bold text-slate-700">
                      {item.totalMarks}M
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-5">{getStatusBadge(item.status)}</td>
                  <td className="py-3 sm:py-4 px-4 sm:px-5 text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wide">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-4 sm:px-5 text-right">
                    <button
                      onClick={() => router.push(`/create?id=${item._id}`)}
                      disabled={item.status === 'failed'}
                      className="h-8 px-2.5 sm:px-3 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 text-[11px] sm:text-xs font-bold rounded-lg transition-all active:scale-95 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="h-3.5 w-3.5 stroke-[2.2]" /> View Workspace
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}