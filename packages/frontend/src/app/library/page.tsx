"use JSX";
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useRouter } from 'next/navigation';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { LibraryCard } from '@/components/library/LibraryCard';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { ConfirmationModal } from '@/components/vault/ConfirmationModal';
import { Loader2, Inbox } from 'lucide-react';

interface AssignmentRecord {
  _id: string;
  subject: string;
  className: string;
  totalQuestions: number;
  totalMarks: number;
  status: string;
  createdAt: string;
  sections?: any[];
  answerKey?: any[];
}

export default function MyLibraryPage() {
  const [assessments, setAssessments] = useState<AssignmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track ongoing deletion cycles
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  
  // Custom Modal States
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const router = useRouter();

  async function fetchLibrary() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5001/api/assignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with non-200 status code: ${response.status}`);
      }

      const rawText = await response.text();
      
      let data;
      try {
        data = JSON.parse(rawText.trim());
      } catch (jsonErr) {
        throw new Error("Received malformed document structures from database record histories.");
      }
      
      if (!Array.isArray(data)) {
        throw new Error("Expected collection array history list, received alternative alternative schema model.");
      }
      
      const completedPapers = data.filter((item: any) => 
        item && 
        item.status === 'completed' && 
        Array.isArray(item.sections) && 
        item.sections.length > 0
      );

      setAssessments(completedPapers);
    } catch (err: any) {
      console.error("🛑 Comprehensive library load exception detailed logs:", err);
      setError(err.message || 'Error pulling your historical files.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleViewPaper = (paper: AssignmentRecord) => {
    useAssignmentStore.setState({
      currentStep: 4,
      generatedPaper: {
        subject: paper.subject,
        className: paper.className,
        totalQuestions: paper.totalQuestions,
        totalMarks: paper.totalMarks,
        sections: paper.sections || [],
        answerKey: paper.answerKey || []
      }
    });
    
    router.push('/create');
  };

  const executeDeleteSequence = async () => {
    if (!activeDeleteId) return;
    const targetId = activeDeleteId;
    
    // Find metadata title matching active state target reference
    const targetDoc = assessments.find(a => a._id === targetId);
    const docTitle = targetDoc ? `${targetDoc.subject} Blueprint` : "Target Assessment";

    try {
      setDeletingIds(prev => ({ ...prev, [targetId]: true }));

      const response = await fetch(`http://localhost:5001/api/assignments/${targetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Backend failed to complete the database deletion request.');
      }

      setAssessments(prev => prev.filter(item => item._id !== targetId));

      // Clean success feedback popup
      setFeedbackState({
        isOpen: true,
        type: 'success',
        title: 'Assessment Purged',
        message: `"${docTitle}" has been permanently deleted from your curriculum records.`
      });
    } catch (err: any) {
      console.error("🛑 Failed to process deletion sequence:", err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Deletion Interrupted',
        message: err.message || 'Unable to drop this document row configuration from the database.'
      });
    } finally {
      setDeletingIds(prev => ({ ...prev, [targetId]: false }));
      setActiveDeleteId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 relative animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Core Modularized Header */}
        <LibraryHeader paperCount={assessments.length} />

        {/* ⏳ LOADING RUNNING TIMEFRAME */}
        {isLoading && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-500">Querying your MongoDB index collections history...</p>
          </div>
        )}

        {/* ❌ ERRONEOUS LOG CAP INTERCEPTOR */}
        {error && !isLoading && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-3 shadow-sm">
            <p className="text-sm font-black text-rose-600 uppercase tracking-wider">Connection Interrupted</p>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {error}. Ensure your backend server cluster process terminal tab is actively running on port 5001.
            </p>
            <button onClick={fetchLibrary} className="h-9 px-4 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all">
              Retry Sync
            </button>
          </div>
        )}

        {/* 📭 VACANT INDEX OVERLAY BOUNDS */}
        {!isLoading && !error && assessments.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center max-w-md mx-auto space-y-5">
            <div className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">
              <Inbox className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">No Assessments Stored Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs font-semibold leading-relaxed">
                Your archive collection has no completed sheets. Run your generation configuration wizard to build your first test blueprint!
              </p>
            </div>
            <Link
              href="/create"
              className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center transition-all active:scale-95"
            >
              Generate First Paper
            </Link>
          </div>
        )}

        {/* 📊 ACTIVE CARDS TEMPLATE FEED */}
        {!isLoading && !error && assessments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((paper) => (
              <LibraryCard 
                key={paper._id}
                paper={paper}
                isDeleting={!!deletingIds[paper._id]}
                onView={handleViewPaper}
                onStageDelete={(id) => setActiveDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 💡 MODULAR FEEDBACK POPOUTS */}
      <FeedbackModal 
        isOpen={feedbackState.isOpen}
        onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))}
        type={feedbackState.type}
        title={feedbackState.title}
        message={feedbackState.message}
      />

      {/* 💡 MODULAR DESTRUCTIVE CONFIRMATION VIEWPORTS */}
      <ConfirmationModal 
        isOpen={!!activeDeleteId}
        onClose={() => setActiveDeleteId(null)}
        onConfirm={executeDeleteSequence}
        title="Confirm Permanent Deletion"
        message="Are you absolutely sure you want to discard this evaluation blueprint? This action will instantly wipe your quiz metrics and completely destroy the document mapping sequence parameters inside MongoDB records permanently."
        confirmText="Confirm Delete"
      />
    </div>
  );
}