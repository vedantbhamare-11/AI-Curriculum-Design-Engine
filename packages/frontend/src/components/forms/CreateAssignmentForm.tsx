"use JSX";
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { 
  Sliders, 
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

  // Functional Local Synchronized UI States
  const [patterns, setPatterns] = useState<PatternOption[]>([]);
  const [vaultDocs, setVaultDocs] = useState<VaultDocOption[]>([]); 
  const [selectedPattern, setSelectedPattern] = useState<PatternOption | null>(null);
  
  // SECURE LOCAL FORM STATE BINDINGS: Eliminates asynchronous state lag completely
  const [subject, setSubject] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [localPatternId, setLocalPatternId] = useState<string>('');
  const [localVaultId, setLocalVaultId] = useState<string>('');
  
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // 1. Hydrate saved paper templates AND vault entries concurrently from MongoDB on mount
  useEffect(() => {
    async function fetchFormDependencies() {
      try {
        setError(null);
        
        // Fetch Exam Blueprint Profiles
        const patternsRes = await fetch('http://localhost:5001/api/patterns');
        if (patternsRes.ok) {
          const patternsData = await patternsRes.json();
          setPatterns(patternsData);
        }

        // Fetch actual textbook assets dynamically out of your Context Vault
        const vaultRes = await fetch('http://localhost:5001/api/vault');
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

  // 2. Poll progress status check logs from backend loop until generation completes
  const pollGenerationStatus = async (assignmentId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/assignments/${assignmentId}`);
        const data = await res.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          // Sync final results to global store for viewer canvas
          store.updateFormFields({ 
            generationStatus: 'completed',
            generatedPaper: data
          });
          store.setStep(4); // Direct over into Step 4 Document Viewer!
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

  // 3. Assemble parameters and fire off multipart FormData package payload
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
      
      console.log("📤 Packaging Context Payload Metadata Bundle:", payloadMetadata);
      formData.append('data', JSON.stringify(payloadMetadata));

      // 💡 FIXED: Append key modified from 'primaryFile' to match your backend's multer upload setup perfectly!
      if (store.primaryFile) {
        formData.append('primaryFile', store.primaryFile); 
      }

      const response = await fetch('http://localhost:5001/api/assignments', {
        method: 'POST',
        body: formData
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

  // Pre-calculate aggregate matrix summary statistics out of the loaded blueprint details
  const totalQuestions = selectedPattern?.sections.reduce((sum, s) => sum + s.questionCount, 0) || 0;
  const totalMarks = selectedPattern?.sections.reduce((sum, s) => sum + (sum + (s.questionCount * s.marksPerQuestion)), 0) || 0;

  if (store.generationStatus === 'pending' || store.generationStatus === 'processing') {
    return (
      <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <h3 className="text-lg font-black text-slate-900">Assembling Your Assessment</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto font-semibold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
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
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Scope Parameters</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Define student group segments, subjects, and parameters boundaries.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" /> Subject Field
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-300 bg-white text-slate-900 text-sm font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Select Target Subject...</option>
                {['Science', 'Mathematics', 'English Literature', 'History', 'Geography', 'Computer Science'].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> Grade / Class Level
              </label>
              <input
                type="text"
                placeholder="e.g., Grade 8, Class 10-A"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full h-11 px-4 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Assessment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-11 px-4 border border-slate-300 bg-white text-slate-900 text-sm font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Dual-Context Data Ingest Dropzones Container */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Contextual Grounding Strategy</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Control the information source grounding priorities layer parameters.</p>
          </div>

          {/* 1st Priority Context File Element Block */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="h-4 w-4 text-indigo-600" /> $1st Priority Immediate Context (Session Lecture Notes / Whiteboard Upload)
            </label>
            
            {!store.primaryFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-1 group"
              >
                <UploadCloud className="h-7 w-7 text-slate-400 group-hover:text-indigo-500 mx-auto transition-colors" />
                <p className="text-xs font-black text-slate-700 group-hover:text-slate-900">Attach temporary handwritten text lesson file snapshot</p>
                <p className="text-[10px] text-slate-400 font-semibold">PDF, TXT or Markdown up to 10MB</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt,.md" className="hidden" />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate max-w-[200px] sm:max-w-xs">{store.primaryFile.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{(store.primaryFile.size / (1024 * 1024)).toFixed(2)} MB • Anchor Grounding</p>
                  </div>
                </div>
                <button type="button" onClick={() => store.setPrimaryFile(null)} className="p-1 border border-slate-200 hover:text-rose-600 bg-white rounded-lg transition-all">
                  <X className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* 2nd Priority Context Permanent Vault Connector Selector Dropdown */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FolderHeart className="h-4 w-4 text-indigo-600" /> $2nd Priority Cross-Reference Book Link (Loaded from Reference Context Vault)
            </label>
            <select
              value={localVaultId}
              onChange={(e) => setLocalVaultId(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-300 bg-white text-slate-900 text-xs font-black rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="">-- Choose Background Reference Book Material (Optional) --</option>
              {vaultDocs.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.title} [{doc.subject}]</option>
              ))}
            </select>
          </div>

          {/* Custom prompts field block instructions parameters focus text areas */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 text-indigo-600" /> Specific Guidance Directives Prompt Prompts
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Focus exclusively on structural evaluation balancing equations. Do not test history variables outside lesson bounds."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full p-3.5 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 Richmond resize-none"
            />
          </div>
        </div>

      </div>

      {/* Right Sidebar Blueprint Selection Card Sticky Panel */}
      <div className="space-y-6 lg:sticky lg:top-6">
        
        {/* Pattern Binder Core Profile Custom Selector */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Exam Blueprint Template</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Enforce custom school structural point weight pattern configurations profiles rules.</p>
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
              className="w-full h-11 px-3 border border-slate-300 bg-white text-slate-900 text-xs font-black rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="">-- Select Saved Exam Pattern Blueprint --</option>
              {patterns.map(p => (
                <option key={p._id} value={p._id}>{p.patternName}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Sections Table Distribution Overview Summary Strip */}
          {selectedPattern && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200/60 pb-2">
                <span>Blueprint Breakdowns</span>
                <span className="text-indigo-600 font-black">{totalMarks} Marks Max</span>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedPattern.sections.map(s => (
                  <div key={s.sectionLetter} className="flex justify-between items-start text-xs leading-normal">
                    <div className="font-bold text-slate-800">
                      <span className="font-black text-indigo-600 mr-1.5">Sec {s.sectionLetter}:</span>
                      {s.sectionType}
                    </div>
                    <div className="font-black text-slate-500 text-right shrink-0 ml-2">
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
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" /> Run Assessment Engine
          </button>
        </div>

      </div>
    </form>
  );
}