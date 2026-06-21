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
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      label: 'Completed & Verified',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Queue Processing',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      label: 'Pipeline Failures',
      value: stats.failed,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50 border-red-100'
    }
  ];

  return (
    /* 📱 ADAPTIVE METRIC COUNTERS GRID LAYOUT: Uses single rows on mobile, 2 columns on tablets, and 4 on desktop */
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {metricCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between group academic-card-lift">
            <div className="space-y-0.5">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-2.5 sm:p-3 rounded-xl border ${card.color} shadow-sm transition-transform duration-200 shrink-0`}>
              <Icon className="h-4 sm:h-5 sm:w-5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}