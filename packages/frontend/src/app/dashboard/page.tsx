"use JSX";
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { RecentAssignments } from '@/components/dashboard/RecentAssignments';
import { Loader2, RefreshCw } from 'lucide-react';

interface Assignment {
  _id: string;
  subject: string;
  className: string;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export default function CoreDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5001/api/assignments');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setAssignments(data);

        // Pre-aggregate structural statistics cleanly on-demand
        const metrics = data.reduce((acc, curr: Assignment) => {
          acc.total += 1;
          if (curr.status === 'completed') acc.completed += 1;
          else if (curr.status === 'failed') acc.failed += 1;
          else acc.pending += 1; // Covers processing & pending states
          return acc;
        }, { total: 0, completed: 0, pending: 0, failed: 0 });

        setStats(metrics);
      }
    } catch (err) {
      console.error("❌ Failed to resolve pipeline execution records indices:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 animate-in fade-in duration-300 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Upper Title Section Row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
              Teacher Workspace Studio
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Platform Overview & Analytical Telemetry Control Panel
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="h-9 w-9 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Server Metrics Feed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        {/* 1. Welcoming Hero Banner Accent */}
        <DashboardGreeting />

        {/* 2. Analytical Metrics Counter Layout Block */}
        {isLoading && assignments.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <DashboardMetrics stats={stats} />
        )}

        {/* 3. Core Status Table Tracking Grid */}
        {isLoading && assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 p-24 text-center rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <p className="text-xs font-bold text-slate-400">Syncing live server generation pipelines...</p>
          </div>
        ) : (
          <RecentAssignments assignments={assignments} />
        )}

      </div>
    </div>
  );
}