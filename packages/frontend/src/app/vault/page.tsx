"use JSX";
'use client';

import React, { useState, useEffect } from 'react';
import { VaultHeader } from '@/components/vault/VaultHeader';
import { VaultFilters } from '@/components/vault/VaultFilters';
import { VaultCard } from '@/components/vault/VaultCard';
import { UploadModal } from '@/components/vault/UploadModal';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { ConfirmationModal } from '@/components/vault/ConfirmationModal';
import { X, Sparkles, BookOpen, Loader2, FilePlay, FileText } from 'lucide-react';
import { apiFetch } from '@/utils/api'; 

interface VaultDocument {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileSizeText: string;
  fileMimeType?: string;
  extractedText?: string; 
  fileBufferBase64?: string;
  createdAt: string;
}

export default function ContextVaultPage() {
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  const [activePreviewDoc, setActivePreviewDoc] = useState<VaultDocument | null>(null);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [pdfModalTitle, setPdfModalTitle] = useState<string>('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    targetId: string;
    targetTitle: string;
  }>({ isOpen: false, targetId: '', targetTitle: '' });

  async function loadVaultCatalog() {
    try {
      setIsLoading(true);
      const res = await apiFetch('/api/vault');
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

  const handleOpenDrawer = async (docId: string) => {
    try {
      const baselineMatch = vaultDocs.find(d => d._id === docId);
      if (!baselineMatch) return;
      setActivePreviewDoc(baselineMatch);

      const res = await apiFetch(`/api/vault/${docId}`);
      if (!res.ok) throw new Error('Failed to pull deep material data lines.');
      
      const completeRichDoc = await res.json();
      setActivePreviewDoc(completeRichDoc);
    } catch (err) {
      console.error("Failed to load drawer data:", err);
    }
  };

  const handleOpenPdfModal = async (docId: string, title: string) => {
    try {
      setIsLoadingPdf(true);
      setPdfModalTitle(title);
      
      const res = await apiFetch(`/api/vault/${docId}`);
      if (!res.ok) throw new Error('Failed to pull file streams.');
      
      const completeRichDoc: VaultDocument = await res.json();

      if (completeRichDoc.fileBufferBase64 && completeRichDoc.fileMimeType === 'application/pdf') {
        const base64Response = await fetch(`data:application/pdf;base64,${completeRichDoc.fileBufferBase64}`);
        const pdfBlob = await base64Response.blob();
        const objectUrl = URL.createObjectURL(pdfBlob);
        setActivePdfUrl(objectUrl);
      } else {
        setFeedbackState({
          isOpen: true,
          type: 'error',
          title: 'Document Layout Warning',
          message: 'The selected repository profile does not contain an attached binary PDF format asset.'
        });
      }
    } catch (err) {
      console.error("❌ Failed to stream PDF:", err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Streaming Error',
        message: 'Could not initialize isolated PDF viewer stream canvas inside browser contexts.'
      });
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleClosePdfModal = () => {
    if (activePdfUrl) {
      URL.revokeObjectURL(activePdfUrl);
      setActivePdfUrl(null);
    }
    setPdfModalTitle('');
  };

  const handleStageDeletion = (docId: string, title: string) => {
    setDeleteConfirmation({ isOpen: true, targetId: docId, targetTitle: title });
  };

  const handleExecutePurge = async () => {
    const { targetId, targetTitle } = deleteConfirmation;
    if (!targetId) return;

    try {
      const res = await apiFetch(`/api/vault/${targetId}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Server rejected document archive deletion pass.');
      
      setFeedbackState({
        isOpen: true,
        type: 'success',
        title: 'Archive Purged Successfully',
        message: `"${targetTitle}" has been permanently scrubbed out of your library catalog.`
      });
      loadVaultCatalog();
    } catch (err: any) {
      console.error(err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Purge Order Refused',
        message: err.message || 'Error executing document deletion passes.'
      });
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !uploadFile) {
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Missing Parameters',
        message: 'Ensure valid title definitions, scope descriptions, and resource text bindings are appended.'
      });
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

      // 🚀 FIXED: Passed cleanly without double explicit JSON boundary overrides crashing body parsing configurations
      const res = await apiFetch('/api/vault', { 
        method: 'POST', 
        body: formData
      });
      if (!res.ok) throw new Error("Backend save failure.");

      setFeedbackState({
        isOpen: true,
        type: 'success',
        title: 'Reference Asset Archived',
        message: `"${newTitle.trim()}" has been cataloged inside the Context Vault.`
      });

      setIsUploadModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setUploadFile(null);
      loadVaultCatalog();
    } catch (err: any) {
      console.error(err);
      setFeedbackState({
        isOpen: true,
        type: 'error',
        title: 'Ingest Pipeline Breakdown',
        message: err.message || 'Error transmitting content parameters to backend configurations routers.'
      });
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
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 relative animate-in fade-in duration-300 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <VaultHeader 
          onOpenUpload={() => setIsUploadModalOpen(true)} 
          documentCount={vaultDocs.length} 
        />

        <VaultFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />

        {isLoading ? (
          <div className="bg-white border border-slate-200 p-16 text-center rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-slate-900" />
            <p className="text-xs font-bold text-slate-400">Querying long-term references collection index...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white border border-slate-200 p-16 rounded-2xl text-center border-dashed">
            <p className="text-xs font-bold text-slate-400">No reference manuals or books cataloged matching active workspace constraints.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map(doc => (
              <VaultCard 
                key={doc._id}
                doc={doc}
                onViewPdf={handleOpenPdfModal}
                onReviseText={handleOpenDrawer}
                onDelete={handleStageDeletion}
              />
            ))}
          </div>
        )}

      </div>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        title={newTitle}
        setTitle={setNewTitle}
        desc={newDesc}
        setDesc={setNewDesc}
        subject={newSubject}
        setSubject={setNewSubject}
        file={uploadFile}
        setFile={setUploadFile}
        isSubmitting={isSubmitting}
      />

      {/* Sliding Revision Drawer Area */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActivePreviewDoc(null)} />
          <div className="w-full max-w-xl bg-white h-screen shadow-2xl flex flex-col justify-between relative z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 px-6">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-slate-800" />
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Revision Panel</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{activePreviewDoc.subject} • {activePreviewDoc.fileSizeText}</p>
                </div>
              </div>
              <button onClick={() => setActivePreviewDoc(null)} className="h-8 w-8 border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all cursor-pointer">
                <X className="h-4 w-4 stroke-[2.5] text-slate-500" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 leading-relaxed bg-white">
              <h2 className="text-base font-black text-slate-900">{activePreviewDoc.title}</h2>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" /> Core Summary Target Scope
                </h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {activePreviewDoc.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Reference Material Inner Text Context
                </h4>
                <div className="w-full h-80 p-4 bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs rounded-xl overflow-y-auto leading-relaxed shadow-inner">
                  <p className="whitespace-pre-line font-medium text-slate-600">
                    {activePreviewDoc.extractedText || "🔍 Loading text data metrics straight from database collection layers..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setActivePreviewDoc(null)} className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm">
                Close Review Section
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoadingPdf && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-5 rounded-xl shadow-2xl flex items-center gap-3 font-black text-xs text-slate-800 border border-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-slate-900" /> Stream deployment buffer processing...
          </div>
        </div>
      )}

      {activePdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={handleClosePdfModal} />
          <div className="w-full max-w-5xl bg-white h-[88vh] rounded-2xl shadow-2xl flex flex-col justify-between relative z-10 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 px-5">
              <div className="flex items-center gap-2.5 min-w-0">
                <FilePlay className="h-4 w-4 text-slate-700 shrink-0" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider truncate pr-4">{pdfModalTitle}</h3>
              </div>
              <button onClick={handleClosePdfModal} className="h-8 w-8 border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer">
                <X className="h-4 w-4 stroke-[2.5] text-slate-500" />
              </button>
            </div>

            <div className="flex-1 w-full bg-slate-100 p-4 min-h-0">
              <iframe 
                src={`${activePdfUrl}#toolbar=1&navpanes=0`} 
                className="w-full h-full rounded-xl border border-slate-200 shadow-inner bg-white" 
                title="Context Vault Isolated PDF Frame Viewer"
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button onClick={handleClosePdfModal} className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm">
                Exit Document Viewer
              </button>
            </div>

          </div>
        </div>
      )}

      <FeedbackModal isOpen={feedbackState.isOpen} onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))} type={feedbackState.type} title={feedbackState.title} message={feedbackState.message} />
      <ConfirmationModal isOpen={deleteConfirmation.isOpen} onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))} onConfirm={handleExecutePurge} title="Confirm Document Removal" message={`Are you sure you want to permanently scrub "${deleteConfirmation.targetTitle}" out of your library catalog references archive?`} confirmText="Erase Asset" />
    </div>
  );
}