"use JSX";
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatternCatalogList } from '@/components/patterns/PatternCatalogList';
import { PatternInspectionModal } from '@/components/patterns/PatternInspectionModal';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { ConfirmationModal } from '@/components/vault/ConfirmationModal';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface SectionInput {
  sectionLetter: string;
  sectionType: string;
  instruction: string;
  questionCount: number;
  marksPerQuestion: number;
  aiGuidelines: string;
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
  
  // Catalog Master Storage State Data
  const [savedPatterns, setSavedPatterns] = useState<PatternProfile[]>([]);
  const [activeInspectPattern, setActiveInspectPattern] = useState<PatternProfile | null>(null);

  // Modal Interactive Overlays Tracker states
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
      const res = await fetch('http://localhost:5001/api/patterns');
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
      const response = await fetch('http://localhost:5001/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        message: err.message || "Could not save pattern configuration profile. Verify network lines."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modern Delete Interceptor Trigger
  const handleStageDeletion = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      targetId: id,
      targetName: name
    });
  };

  const handleExecuteDelete = async () => {
    const { targetId, targetName } = deleteConfirmation;
    if (!targetId) return;

    try {
      const res = await fetch(`http://localhost:5001/api/patterns/${targetId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server rejected template profile deletion pass.');

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
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side 2 Columns: Construction Workspace Form */}
        <form onSubmit={handleSavePattern} className="lg:col-span-2 space-y-6">
          
          {/* Action Header bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => router.push('/create')}
                className="h-9 w-9 border border-slate-200 bg-white text-slate-600 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 truncate">
                  <Sliders className="h-5 w-5 text-indigo-600" /> Blueprint Customizer
                </h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  Build bespoke exam weights and map AI guardrails
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 transition-all shrink-0 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save Blueprint Archetype</>}
            </button>
          </div>

          {/* Meta Configuration Card Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Pattern Template Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Class 10 CBSE Mid-Term Science"
                value={patternName}
                onChange={(e) => setPatternName(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Default Subject Binding <span className="text-slate-400 font-medium lowercase">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g., Physics, Mathematics"
                value={subjectDefault}
                onChange={(e) => setSubjectDefault(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Aggregation Data Strip */}
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-sm flex items-center justify-between text-xs font-bold tracking-wide">
            <div className="flex gap-4">
              <div>Sections: <span className="text-indigo-400 font-black">{sections.length}</span></div>
              <div>Total Questions: <span className="text-indigo-400 font-black">{totalQuestions}</span></div>
            </div>
            <div>Evaluation Total Weight: <span className="text-emerald-400 font-black text-sm">{totalMarks} Marks</span></div>
          </div>

          {/* Section Dynamic Multi-Repeater Matrix Loops */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={section.sectionLetter}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="h-6 px-3 bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-[10px] tracking-wider uppercase rounded-md flex items-center justify-center shadow-sm">
                    Section {section.sectionLetter}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="h-7 w-7 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg hover:bg-rose-50/50 flex items-center justify-center transition-all opacity-100 lg:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Question Category Type</label>
                    <input
                      type="text" required
                      placeholder="e.g., Short Answer Questions"
                      value={section.sectionType}
                      onChange={(e) => handleFieldChange(index, 'sectionType', e.target.value)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Questions Count</label>
                    <input
                      type="number" min={1} required
                      value={section.questionCount}
                      onChange={(e) => handleFieldChange(index, 'questionCount', parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Marks Per Item</label>
                    <input
                      type="number" min={1} required
                      value={section.marksPerQuestion}
                      onChange={(e) => handleFieldChange(index, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Teacher Instruction Script Text</label>
                  <input
                    type="text" required
                    placeholder="e.g., Answer all questions carrying uniform marks weights."
                    value={section.instruction}
                    onChange={(e) => handleFieldChange(index, 'instruction', e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3" /> Grounding AI Few-Shot Guidelines Context</label>
                  <textarea
                    rows={2}
                    placeholder="Provide prompt parameters rules (e.g., 'Ensure questions use a brief context paragraph setup.')"
                    value={section.aiGuidelines}
                    onChange={(e) => handleFieldChange(index, 'aiGuidelines', e.target.value)}
                    className="w-full p-3 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSection}
            className="w-full h-11 border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Append Next Structural Section Block
          </button>
        </form>

        {/* Right Side Column: Saved Blueprint Index View Layer Component */}
        <div className="lg:col-span-1">
          <PatternCatalogList 
            patterns={savedPatterns as any} // 💡 Enforces consistent data structural binding paths
            onSelectView={(pat) => setActiveInspectPattern(pat as any)}
            onStageDelete={handleStageDeletion}
          />
        </div>

      </div>

      {/* 🔍 Isolated Blueprint Template Viewer Modal Overlay */}
      <PatternInspectionModal 
        pattern={activeInspectPattern}
        onClose={() => setActiveInspectPattern(null)}
      />

      {/* Reusable Operational Alerts Feedback Panel Popout */}
      <FeedbackModal 
        isOpen={feedbackState.isOpen}
        onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))}
        type={feedbackState.type}
        title={feedbackState.title}
        message={feedbackState.message}
      />

      {/* Reusable Destructive Confirmation Interceptor Popup */}
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