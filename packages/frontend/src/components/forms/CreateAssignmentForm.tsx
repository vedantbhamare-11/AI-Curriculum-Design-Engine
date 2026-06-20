"use JSX";
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  UploadCloud, 
  ListChecks, 
  Sparkles, 
  Loader2, 
  FileText, 
  X,
  FolderHeart
} from 'lucide-react';
import { apiFetch } from '@/utils/api'; // 🔥 Unified environment wrapper utility linked

interface SectionItem {
  sectionLetter: string;
  sectionType: string;
  instruction: string;
  questionCount: number;
  marksPerQuestion: number;
  aiGuidelines?: string;
}

interface PatternOption {
  _id: string;
  patternName: string;
  subjectDefault?: string;
  sections: SectionItem[];
}

interface VaultDocOption {
  _id: string; 
  title: string;
  subject: string;
}

export default function UnifiedCreationForm() {
  const store = useAssignmentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patterns, setPatterns] = useState<PatternOption[]>([]);
  const [vaultDocs, setVaultDocs] = useState<VaultDocOption[]>([]); 
  const [selectedPattern, setSelectedPattern] = useState<PatternOption | null>(null);
  
  const [subject, setSubject] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [localPatternId, setLocalPatternId] = useState<string>('');
  const [localVaultId, setLocalVaultId] = useState<string>('');
  
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFormDependencies() {
      try {
        setError(null);
        
        // 🚀 PRODUCTION UPGRADE: Pulled pattern schema metrics over environment client configuration wrapper
        const patternsRes = await apiFetch('/api/patterns');
        if (patternsRes.ok) {
          const patternsData = await patternsRes.json();
          setPatterns(patternsData);
        }

        // 🚀 PRODUCTION UPGRADE: Pulled permanent vault indexes safely
        const vaultRes = await apiFetch('/api/vault');
        if (vaultRes.ok) {
          const vaultData = await vaultRes.json();
          setVaultDocs(vaultData);
        }
      } catch (err: any) {
        console.error("Dependency loading failure:", err);
        setError('Failed to synchronize local workspace configurations database indices.');
      }
    }
    fetchFormDependencies();
  }, []);

  const pollGenerationStatus = async (assignmentId: string) => {
    const interval = setInterval(async () => {
      try {
        // 🚀 PRODUCTION UPGRADE: Polling background queues through active Render pipeline routers
        const res = await apiFetch(`/api/assignments/${assignmentId}`);
        const data = await res.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          store.updateFormFields({ 
            generationStatus: 'completed',
            generatedPaper: data
          });
          store.setStep(4); 
        } else if (data.status === 'failed') {
          clearInterval(interval);
          store.updateFormFields({ generationStatus: 'failed' });
          setLoadingMessage('AI worker compilation collapsed. Please review data parameters.');
        }
      } catch (err) {
        console.error('Polling link interrupted:', err);
      }
    }, 2000);
  };

  const handleTriggerGeneration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !className || !dueDate || !localPatternId) {
      setError('Missing parameters. Ensure a valid subject, class target, due date, and blueprint pattern profile are provided.');
      return;
    }

    try {
      setError(null);
      store.updateFormFields({ generationStatus: 'pending' });
      setLoadingMessage('Uploading context files and initiating background creation tasks...');

      const formData = new FormData();
      
      const payloadMetadata = {
        subject,
        className,
        dueDate,
        additionalInstructions,
        selectedPatternId: localPatternId,
        secondaryContextId: localVaultId || null
      };
      
      formData.append('data', JSON.stringify(payloadMetadata));

      if (store.primaryFile) {
        formData.append('primaryFile', store.primaryFile); 
      }

      // 🚀 PRODUCTION UPGRADE: Transmitting complex multi-part stream bundles over secure cloud layout links
      const response = await apiFetch('/api/assignments', {
        method: 'POST',
        body: formData,
        headers: {} // 💡 Let browser define boundary headers safely
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server rejected creation request bundle.');

      store.updateFormFields({
        assignmentId: result.assignmentId,
        jobId: result.jobId,
        generationStatus: 'processing'
      });

      setLoadingMessage('Gemini Engine is scanning your Context Vault document lines and mapping sections...');
      pollGenerationStatus(result.assignmentId);

    } catch (err: any) {
      console.error(err);
      store.updateFormFields({ generationStatus: 'failed' });
      setLoadingMessage(err.message || 'Pipeline initialization breakdown.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      store.setPrimaryFile(e.target.files[0]);
    }
  };

  const totalQuestions = selectedPattern?.sections.reduce((sum, s) => sum + s.questionCount, 0) || 0;
  const totalMarks = selectedPattern?.sections.reduce((sum, s) => sum + (s.questionCount * s.marksPerQuestion), 0) || 0;

  if (store.generationStatus === 'pending' || store.generationStatus === 'processing') {
    return (
      <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
        <Loader2 className="h-8 w-8 text-slate-900 animate-spin" />
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Assembling Your Assessment</h3>
        <p className="text-xs font-bold text-slate-500 max-w-md mx-auto bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
          {loadingMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleTriggerGeneration} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      {/* Left Panel Parameters Columns Deck */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Core Administrative Properties Setup Box */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Scope Parameters</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">Define student group segments, subjects, and parameters boundaries.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-slate-400" /> Subject Field
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-200 bg-white text-slate-900 text-sm font-semibold rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="">Select Target Subject...</option>
                {['Science', 'Mathematics', 'English Literature', 'History', 'Geography', 'Computer Science'].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-slate-400" /> Grade / Class Level
              </label>
              <input
                type="text"
                placeholder="e.g., Grade 8, Class 10-A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" /> Assessment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 bg-white text-slate-900 text-sm font-semibold rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Dual-Context Data Ingest Dropzones Container */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Contextual Grounding Strategy</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">Control the information source grounding priorities layer parameters.</p>
          </div>

          {/* 1st Priority Context File Element Block */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="h-4 w-4 text-slate-400" /> 1st Priority Immediate Context (Lecture Notes / Whiteboard Upload)
            </label>
            
            {!store.primaryFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-all space-y-1 group"
              >
                <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-slate-600 mx-auto transition-colors stroke-[2.2]" />
                <p className="text-xs font-black text-slate-700">Attach temporary handwritten text lesson file snapshot</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF, TXT or Markdown up to 10MB</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt,.md" className="hidden" />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-slate-900 text-white flex items-center justify-center rounded-lg font-black text-[10px] uppercase tracking-wider">Source</div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate max-w-[200px] sm:max-w-xs">{store.primaryFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{(store.primaryFile.size / (1024 * 1024)).toFixed(2)} MB • Anchor Grounding</p>
                  </div>
                </div>
                <button type="button" onClick={() => store.setPrimaryFile(null)} className="p-1 border border-slate-200 hover:text-red-600 bg-white rounded-lg transition-all cursor-pointer">
                  <X className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* 2nd Priority Context Permanent Vault Connector Selector Dropdown */}
          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderHeart className="h-4 w-4 text-slate-400" /> 2nd Priority Cross-Reference Book Link (Loaded from Reference Context Vault)
            </label>
            <select
              value={localVaultId}
              onChange={(e) => setLocalVaultId(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-200 bg-white text-slate-900 text-xs font-black rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="">-- Choose Background Reference Book Material (Optional) --</option>
              {vaultDocs.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.title} [{doc.subject}]</option>
              ))}
            </select>
          </div>

          {/* Custom prompts field block instructions parameters focus text areas */}
          <div className="space-y-1.5 border-t border-slate-100 pt-5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-slate-400" /> Specific Guidance Directives Prompts
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Focus exclusively on structural evaluation balancing equations. Do not test history variables outside lesson bounds."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full p-3.5 border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl focus:outline-none focus:border-slate-400 resize-none animate-none"
            />
          </div>
        </div>

      </div>

      {/* Right Sidebar Blueprint Selection Card Sticky Panel */}
      <div className="space-y-6 lg:sticky lg:top-6">
        
        {/* Pattern Binder Core Profile Custom Selector */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Exam Blueprint Template</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">Enforce custom school structural point weight pattern configurations profiles rules.</p>
          </div>

          <div className="space-y-1.5">
            <select
              value={localPatternId}
              onChange={(e) => {
                const id = e.target.value;
                setLocalPatternId(id);
                const match = patterns.find(p => p._id === id) || null;
                setSelectedPattern(match);
              }}
              className="w-full h-11 px-3 border border-slate-200 bg-white text-slate-900 text-xs font-black rounded-xl focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="">-- Select Saved Exam Pattern Blueprint --</option>
              {patterns.map(p => (
                <option key={p._id} value={p._id}>{p.patternName}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Sections Table Distribution Overview Summary Strip */}
          {selectedPattern && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-2">
                <span>Blueprint Breakdown</span>
                <span className="text-slate-900 font-black tracking-normal normal-case">{totalMarks} Marks Max</span>
              </div>
              
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                {selectedPattern.sections.map(s => (
                  <div key={s.sectionLetter} className="flex justify-between items-start text-xs leading-normal font-bold">
                    <div className="text-slate-600">
                      <span className="font-black text-slate-900 mr-1">Sec {s.sectionLetter}:</span>
                      {s.sectionType}
                    </div>
                    <div className="text-slate-400 shrink-0 ml-2">
                      {s.questionCount} × {s.marksPerQuestion}m
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core submission execution action button block */}
          <button
            type="submit"
            className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 stroke-[2.2]" /> Run Assessment Engine
          </button>
        </div>

      </div>
    </form>
  );
}