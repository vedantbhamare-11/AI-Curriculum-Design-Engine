"use JSX";
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useRouter } from 'next/navigation';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { LibraryFilters } from '@/components/library/LibraryFilters'; 
import { LibraryCard } from '@/components/library/LibraryCard';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { ConfirmationModal } from '@/components/vault/ConfirmationModal';
import { Loader2, Inbox } from 'lucide-react';
import { apiFetch } from '@/utils/api';

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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const router = useRouter();

  async function fetchLibrary() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFetch('/api/assignments', { method: 'GET' });

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
        throw new Error("Expected collection array history list.");
      }
      
      const completedPapers = data.filter((item: any) => 
        item && 
        item.status === 'completed' && 
        Array.isArray(item.sections) && 
        item.sections.length > 0
      );
      setAssessments(completedPapers);
    } catch (err: any) {
      console.error("🛑 Library exception detailed logs:", err);
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
    
    const targetDoc = assessments.find(a => a._id === targetId);
    const docTitle = targetDoc ? `${targetDoc.subject} Blueprint` : "Target Assessment";

    try {
      setDeletingIds(prev => ({ ...prev, [targetId]: true }));
      const response = await apiFetch(`/api/assignments/${targetId}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Backend failed to complete the database deletion request.');
      }
      setAssessments(prev => prev.filter(item => item._id !== targetId));

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

  const filteredAssessments = assessments.filter(paper => {
    const matchesSearch = 
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      paper.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || paper.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  return (
    /* 📱 MOBILE INSTULATION PADDING: Lowered root gutters down to py-4 px-4 dynamically on thin smartphones */
    <div className="w-full min-h-screen bg-slate-50 py-4 px-4 sm:py-8 sm:px-10 lg:px-12 relative animate-in fade-in duration-300 text-slate-900 space-y-4 sm:space-y-6">
      
      <LibraryHeader paperCount={assessments.length} />

      <LibraryFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />

      <div>
        {/* ⏳ LOADING STATE VIEW */}
        {isLoading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-16 text-center shadow-sm flex flex-col items-center justify-center gap-2 min-h-62.5">
            <Loader2 className="h-6 w-6 text-slate-900 animate-spin" />
            <p className="text-xs font-bold text-slate-400">Querying your database archive collections history...</p>
          </div>
        )}

        {/* ❌ ERROR INTERCEPTOR */}
        {error && !isLoading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-black text-red-600 uppercase tracking-wider">Connection Interrupted</p>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {error}. Verify your backend microservice environment task is actively listening on Render cloud routes.
              </p>
            </div>
            <button 
              onClick={fetchLibrary} 
              className="w-full sm:w-auto h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* 📭 EMPTY STATE / SEARCH EXCLUSIONS VIEW */}
        {!isLoading && !error && filteredAssessments.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-16 text-center shadow-sm flex flex-col items-center justify-center max-w-md mx-auto space-y-5">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 shadow-sm">
              <Inbox className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">No Target Match Found</h3>
              <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">
                We couldn't locate any saved exam sheets or patterns matching your query input fields. Try refining your keywords!
              </p>
            </div>
            {assessments.length === 0 && (
              <Link
                href="/create"
                className="w-full h-10 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center transition-all active:scale-95"
              >
                Generate First Paper
              </Link>
            )}
          </div>
        )}

        {/* 📊 DYNAMIC CARDS GRID */}
        {!isLoading && !error && filteredAssessments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredAssessments.map((paper) => (
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

      <FeedbackModal isOpen={feedbackState.isOpen} onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))} type={feedbackState.type} title={feedbackState.title} message={feedbackState.message} />
      <ConfirmationModal isOpen={!!activeDeleteId} onClose={() => setActiveDeleteId(null)} onConfirm={executeDeleteSequence} title="Confirm Permanent Deletion" message="Are you absolutely sure you want to discard this evaluation blueprint? This will permanently erase quiz text metrics from database records." confirmText="Erase Asset Record" />
    </div>
  );
}