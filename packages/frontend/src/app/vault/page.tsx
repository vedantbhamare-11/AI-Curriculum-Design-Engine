"use JSX";
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderHeart, 
  UploadCloud, 
  Search, 
  FileText, 
  Eye, 
  Calendar, 
  X,
  Sparkles,
  BookOpen,
  Loader2
} from 'lucide-react';

interface VaultDocument {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileSizeText: string;
  extractedText?: string; 
  createdAt: string;
}

export default function ContextVaultPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Functional Layout Core States
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activePreviewDoc, setActivePreviewDoc] = useState<VaultDocument | null>(null);
  
  // Creation Modal Overlay Form States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load materials directly out of MongoDB collection feed
  async function loadVaultCatalog() {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5001/api/vault');
      const data = await res.json();
      if (Array.isArray(data)) setVaultDocs(data);
    } catch (err) {
      console.error("Failed to load vault index references:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadVaultCatalog();
  }, []);

  // 💡 FIXED: Dynamically pulls complete data profiles on side-panel initialization
  const handleOpenPreview = async (docId: string) => {
    try {
      // 1. Snaps open drawer with available catalog layout metadata instantly
      const baselineMatch = vaultDocs.find(d => d._id === docId);
      if (!baselineMatch) return;
      setActivePreviewDoc(baselineMatch);

      // 2. Query target on-demand single lookup endpoint explicitly
      const res = await fetch(`http://localhost:5001/api/vault/${docId}`);
      if (!res.ok) throw new Error('Failed to pull deep material data lines.');
      
      const completeRichDoc = await res.json();
      
      // 3. Mount rich text fields straight to screen state layer
      setActivePreviewDoc(completeRichDoc);
    } catch (err) {
      console.error("Failed to load document content stream bounds:", err);
    }
  };

  // 2. Submit multi-part structural upload payload to backend API path
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !uploadFile) {
      alert("Please provide a Title, Description, and an attached reference file.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('data', JSON.stringify({
        title: newTitle.trim(),
        description: newDesc.trim(),
        subject: newSubject
      }));
      
      formData.append('vaultFile', uploadFile); 

      const res = await fetch('http://localhost:5001/api/vault', {
        method: 'POST',
        body: formData 
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const rawTextHtml = await res.text();
        console.error("🚨 HTML Fallback intercepted from backend:", rawTextHtml);
        throw new Error(`Server returned non-JSON response (${res.status}). Check your backend terminal log for crashes!`);
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Backend failed to accept file storage reference.");
      }

      alert("Reference textbook document archived inside Context Vault successfully!");
      setIsUploadModalOpen(false);
      
      setNewTitle('');
      setNewDesc('');
      setUploadFile(null);
      
      loadVaultCatalog();
    } catch (err: any) {
      console.error("Transmission error details:", err);
      alert(err.message || "Error transmitting file asset data context to endpoint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDocs = vaultDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || doc.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Hub Title Action Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:text-2xl">
              <FolderHeart className="h-6 w-6 text-indigo-600" /> Reference Context Vault
            </h1>
            <p className="text-sm text-slate-600 font-semibold">
              Archive reference textbooks, syllabi, and guidelines to select as background context.
            </p>
          </div>

          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 transition-all self-start sm:self-auto active:scale-95"
          >
            <UploadCloud className="h-4 w-4 stroke-[2.5]" /> Upload Vault Document
          </button>
        </div>

        {/* Filters Panel strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Science', 'Mathematics', 'English Literature', 'History'].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`h-9 px-4 text-xs font-bold rounded-xl border transition-all ${
                  selectedSubject === sub
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spreads Container */}
        {isLoading ? (
          <div className="bg-white border border-slate-200 p-16 text-center rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
            <p className="text-sm font-bold text-slate-500">Querying long-term references collection index...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-200 p-16 rounded-2xl text-center border-dashed">
            <p className="text-sm font-bold text-slate-500">No reference manuals or books cataloged here yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map(doc => (
              <div key={doc._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group h-64">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-lg uppercase">
                      {doc.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {doc.fileSizeText}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(doc._id)} 
                    className="h-8 px-3 border border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Eye className="h-3.5 w-3.5" /> Revise Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Upload Overlay Slide Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsUploadModalOpen(false)} />
          <form onSubmit={handleUploadSubmit} className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-indigo-600" /> Catalog Reference Textbook
              </h3>
              <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Book / Material Title</label>
                  <input type="text" required placeholder="e.g., NCERT Grade 10 Science Book" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Subject Category</label>
                  <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full h-10 px-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600">
                    {['Science', 'Mathematics', 'English Literature', 'History'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Content Summary Description</label>
                <textarea rows={2} required placeholder="Summarize the core topics covered so you can identify it instantly..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-400" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">File Upload Target</label>
                {!uploadFile ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-all space-y-1 group">
                    <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 mx-auto transition-colors" />
                    <p className="text-xs font-black text-slate-600 group-hover:text-slate-800">Select textbook or manual document path</p>
                    <input type="file" ref={fileInputRef} required onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} accept=".pdf,.txt,.md" className="hidden" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl">
                    <p className="text-xs font-black text-slate-800 truncate max-w-xs">{uploadFile.name}</p>
                    <button type="button" onClick={() => setUploadFile(null)} className="text-slate-400 hover:text-rose-600"><X className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
              <button type="button" onClick={() => setIsUploadModalOpen(false)} className="h-10 px-4 border border-slate-200 rounded-xl text-slate-600">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-1 min-w-[140px] shadow-sm">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Catalog Archive'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Sliding Revision Side-Over Panel */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActivePreviewDoc(null)} />
          <div className="w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col justify-between relative z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header Area */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 truncate max-w-[320px]">Revision Panel</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{activePreviewDoc.subject} • {activePreviewDoc.fileSizeText}</p>
                </div>
              </div>
              <button onClick={() => setActivePreviewDoc(null)} className="h-8 w-8 border border-slate-200 hover:border-slate-300 bg-white rounded-lg flex items-center justify-center transition-colors">
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Document Content Viewport Container */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5 leading-relaxed bg-white">
              <div className="space-y-1.5">
                <h2 className="text-base font-black text-slate-900">{activePreviewDoc.title}</h2>
                <div className="h-0.5 w-12 bg-indigo-600 rounded" />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Core Description Summary
                </h4>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {activePreviewDoc.description}
                </p>
              </div>

              {/* High-Contrast Context Content Text Area Block Box */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" /> Reference Material Inner Text Context
                </h4>
                <div className="w-full h-80 p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800 overflow-y-auto leading-relaxed shadow-inner">
                  {/* 💡 FIXED: Dynamically binds the real text property retrieved on handleOpenPreview */}
                  <p className="whitespace-pre-line text-slate-300">
                    {activePreviewDoc.extractedText || "🔍 Loading text data metrics straight from collection database instances..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Panel Bottom Sticky Control Row */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setActivePreviewDoc(null)} className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
                Close Review Section
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}