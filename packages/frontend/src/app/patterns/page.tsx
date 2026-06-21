"use JSX";
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatternHeader from '@/components/patterns/PatternHeader';import { PatternCatalogList } from '@/components/patterns/PatternCatalogList';
import { PatternInspectionModal } from '@/components/patterns/PatternInspectionModal';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { ConfirmationModal } from '@/components/vault/ConfirmationModal';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2
} from 'lucide-react';
import { apiFetch } from '@/utils/api';

interface SectionInput {
  sectionLetter: string;
  sectionType: string;
  instruction: string;
  questionCount: number;
  marksPerQuestion: number;
  aiGuidelines?: string; 
}

interface PatternProfile {
  _id: string;
  patternName: string;
  subjectDefault?: string;
  sections: SectionInput[];
}

export default function CustomPatternsPage() {
  const router = useRouter();
  const [patternName, setPatternName] = useState('');
  const [subjectDefault, setSubjectDefault] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [savedPatterns, setSavedPatterns] = useState<PatternProfile[]>([]);
  const [activeInspectPattern, setActiveInspectPattern] = useState<PatternProfile | null>(null);

  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    targetId: string;
    targetName: string;
  }>({ isOpen: false, targetId: '', targetName: '' });

  const [sections, setSections] = useState<SectionInput[]>([
    {
      sectionLetter: 'A',
      sectionType: 'Multiple Choice Questions',
      instruction: 'Attempt all questions. Choose the correct option from the choices given below.',
      questionCount: 5,
      marksPerQuestion: 1,
      aiGuidelines: 'Ensure each question has exactly 4 options labeled A), B), C), and D).'
    }
  ]);

  async function fetchPatternsCatalog() {
    try {
      const res = await apiFetch('/api/patterns');
      const data = await res.json();
      if (Array.isArray(data)) setSavedPatterns(data);
    } catch (err) {
      console.error("Failed to query baseline database pattern schema maps:", err);
    }
  }

  useEffect(() => {
    fetchPatternsCatalog();
  }, []);

  const handleAddSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length);
    setSections([
      ...sections,
      {
        sectionLetter: nextLetter,
        sectionType: '',
        instruction: '',
        questionCount: 3,
        marksPerQuestion: 2,
        aiGuidelines: ''
      }
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length === 1) return; 
    const filtered = sections.filter((_, i) => i !== index);
    const reindexed = filtered.map((sec, i) => ({
      ...sec,
      sectionLetter: String.fromCharCode(65 + i)
    }));
    setSections(reindexed);
  };

  const handleFieldChange = (index: number, field: keyof SectionInput, value: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleSavePattern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternName.trim()) {
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a recognizable name for this custom pattern profile before archiving.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/api/patterns', {
        method: 'POST',
        body: JSON.stringify({
          patternName: patternName.trim(),
          subjectDefault: subjectDefault.trim() || undefined,
          sections
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to preserve configuration model.");
      
      setFeedbackState({
        isOpen: true,
        type: 'success',
        title: 'Custom Template Saved',
        message: `"${patternName.trim()}" has been cataloged as a reusable blueprint option.`
      });

      setPatternName('');
      setSubjectDefault('');
      fetchPatternsCatalog();
    } catch (err: any) {
      console.error(err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Pipeline Breakdown',
        message: err.message || "Could not save pattern configuration profile."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageDeletion = (id: string, name: string) => {
    setDeleteConfirmation({ isOpen: true, targetId: id, targetName: name });
  };

  const handleExecuteDelete = async () => {
    const { targetId, targetName } = deleteConfirmation;
    if (!targetId) return;

    try {
      const res = await apiFetch(`/api/patterns/${targetId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Server rejected template profile deletion pass.');

      setFeedbackState({
        isOpen: true,
        type: 'success',
        title: 'Template Erased',
        message: `"${targetName}" has been completely dropped out of your saved system parameters.`
      });
      fetchPatternsCatalog();
    } catch (err: any) {
      console.error(err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Deletions Blocked',
        message: err.message || 'Error occurred handling deletion endpoints rules matches.'
      });
    }
  };

  const totalQuestions = sections.reduce((sum, sec) => sum + (Number(sec.questionCount) || 0), 0);
  const totalMarks = sections.reduce((sum, sec) => sum + ((Number(sec.questionCount) || 0) * (Number(sec.marksPerQuestion) || 0)), 0);

  return (
    /* 📱 RESPONSIVE SPACE BASELINE: Dropped default margins down to px-4 on compact mobile screens */
    <div className="w-full min-h-screen bg-slate-50 py-4 px-4 sm:py-8 sm:px-10 lg:px-12 animate-in fade-in duration-300 text-slate-900 space-y-4 sm:space-y-6">
      
      <PatternHeader 
        onAppendSection={handleAddSection} 
        patternCount={savedPatterns.length} 
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left Side 2 Columns: Construction Workspace Form */}
        <form onSubmit={handleSavePattern} className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Core Configuration Meta Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Pattern Template Name</label>
              <input
                type="text" required
                placeholder="e.g., Class 10 CBSE Mid-Term Science"
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Default Subject Binding</label>
              <input
                type="text"
                placeholder="e.g., Physics, Mathematics"
                value={subjectDefault}
                onChange={(e) => setSubjectDefault(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 📱 FLEX-DIRECTION FLUID STRIP: Shifts metadata counters and submit buttons vertically on small screens */}
          <div className="bg-white border border-slate-200 p-4 sm:px-5 sm:py-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex justify-between sm:justify-start gap-6 border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0">
              <div>Sections: <span className="text-slate-900 font-black">{sections.length}</span></div>
              <div>Total Questions: <span className="text-slate-900 font-black">{totalQuestions}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-left sm:text-right">Evaluation Total: <span className="text-slate-900 font-black text-sm tracking-normal normal-case">{totalMarks} Marks</span></div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" /> : <>Save Blueprint</>}
              </button>
            </div>
          </div>

          {/* Section Dynamic Multi-Repeater Matrix Loops */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={section.sectionLetter}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="h-6 px-3 bg-slate-50 border border-slate-200 text-slate-800 font-black text-[10px] tracking-wider uppercase rounded-md flex items-center justify-center">
                    Section {section.sectionLetter}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="h-7 w-7 text-slate-400 hover:text-red-600 border border-transparent rounded-lg hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Question Input Configurations Stack Wrapper */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Question Category Type</label>
                    <input
                      type="text" required
                      placeholder="e.g., Short Answer Questions"
                      value={section.sectionType}
                      onChange={(e) => handleFieldChange(index, 'sectionType', e.target.value)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Questions Count</label>
                    <input
                      type="number" min={1} required
                      value={section.questionCount}
                      onChange={(e) => handleFieldChange(index, 'questionCount', parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Marks Per Item</label>
                    <input
                      type="number" min={1} required
                      value={section.marksPerQuestion}
                      onChange={(e) => handleFieldChange(index, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Teacher Instruction Script Text</label>
                  <input
                    type="text" required
                    placeholder="e.g., Answer all questions carrying uniform marks weights."
                    value={section.instruction}
                    onChange={(e) => handleFieldChange(index, 'instruction', e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" /> Grounding AI Few-Shot Guidelines Context</label>
                  <textarea
                    rows={2}
                    placeholder="Provide prompt parameters rules (e.g., 'Ensure questions use a brief context paragraph setup.')"
                    value={section.aiGuidelines || ''}
                    onChange={(e) => handleFieldChange(index, 'aiGuidelines', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Right Side Column: Saved Blueprint Index View Layer Component */}
        <div className="lg:col-span-1">
          <PatternCatalogList 
            patterns={savedPatterns}
            onSelectView={(pat) => setActiveInspectPattern(pat)}
            onStageDelete={handleStageDeletion}
          />
        </div>

      </div>

      <PatternInspectionModal 
        pattern={activeInspectPattern}
        onClose={() => setActiveInspectPattern(null)}
      />

      <FeedbackModal 
        isOpen={feedbackState.isOpen}
        onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))}
        type={feedbackState.type}
        title={feedbackState.title}
        message={feedbackState.message}
      />

      <ConfirmationModal 
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleExecuteDelete}
        title="Confirm Blueprint Erasure"
        message={`Are you completely sure you want to scrub "${deleteConfirmation.targetName}" permanently out of your custom configuration profiles? This cannot be undone.`}
        confirmText="Erase Template"
      />

    </div>
  );
}