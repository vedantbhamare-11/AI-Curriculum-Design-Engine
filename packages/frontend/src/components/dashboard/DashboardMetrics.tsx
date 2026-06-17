"use JSX";
'use client';

import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface MetricStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
}

interface DashboardMetricsProps {
  stats: MetricStats;
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const metricCards = [
    {
      label: 'Total Generated Papers',
      value: stats.total,
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50'
    },
    {
      label: 'Completed & Verified',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50'
    },
    {
      label: 'Queue Processing',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100/50'
    },
    {
      label: 'Pipeline Failures',
      value: stats.failed,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-100/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metricCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all duration-200">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl border ${card.color} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="h-5 w-5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}