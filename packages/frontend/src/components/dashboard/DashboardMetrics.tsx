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
      color: 'text-school-ink bg-tint-blue border-blue-100'
    },
    {
      label: 'Completed & Verified',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-school-emerald bg-tint-emerald border-emerald-100'
    },
    {
      label: 'Queue Processing',
      value: stats.pending,
      icon: Clock,
      color: 'text-school-amber bg-tint-amber border-amber-200/60'
    },
    {
      label: 'Pipeline Failures',
      value: stats.failed,
      icon: AlertTriangle,
      color: 'text-school-rose bg-red-50 border-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metricCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group academic-card-lift">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-2xl font-black text-school-navy tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl border ${card.color} shadow-sm transition-transform duration-200`}>
              <Icon className="h-5 w-5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}