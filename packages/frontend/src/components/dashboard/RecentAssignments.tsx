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
        return <span className="inline-flex gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-tint-emerald text-school-emerald border border-emerald-200/50 shadow-sm"><CheckCircle className="h-3.5 w-3.5 stroke-[2.2]" /> Ready</span>;
      case 'processing':
        return <span className="inline-flex gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-tint-blue text-school-ink border border-blue-200/50 shadow-sm"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generation</span>;
      case 'failed':
        return <span className="inline-flex gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-50 text-school-rose border border-red-200/50 shadow-sm"><AlertCircle className="h-3.5 w-3.5 stroke-[2.2]" /> Failed</span>;
      default:
        return <span className="inline-flex gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-tint-amber text-school-amber border border-amber-200/50 shadow-sm"><Clock className="h-3.5 w-3.5 stroke-[2.2]" /> Queue</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-black text-school-navy uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4 w-4 text-school-ink stroke-[2.2]" /> Recent Creation Pipelines
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">Subject Details</th>
              <th className="py-3 px-5">Target Grade</th>
              <th className="py-3 px-5">Max Weight</th>
              <th className="py-3 px-5">Execution Status</th>
              <th className="py-3 px-5">Dispatched Date</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-400">
                  No active assessment creation logs found in history profiles.
                </td>
              </tr>
            ) : (
              assignments.slice(0, 5).map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-5 font-black text-school-navy group-hover:text-school-ink transition-colors">
                    {item.subject}
                  </td>
                  <td className="py-4 px-5 text-slate-500 font-bold">{item.className}</td>
                  <td className="py-4 px-5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 border border-slate-200/40 rounded-md text-xs font-bold text-slate-700">
                      {item.totalMarks}M
                    </span>
                  </td>
                  <td className="py-4 px-5">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-5 text-xs text-slate-400 font-bold uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => router.push(`/create?id=${item._id}`)}
                      disabled={item.status === 'failed'}
                      className="h-8 px-3 border border-slate-200 hover:border-school-ink hover:bg-tint-blue text-slate-600 hover:text-school-ink disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600 text-xs font-bold rounded-lg transition-all active:scale-95 inline-flex items-center gap-1 cursor-pointer"
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