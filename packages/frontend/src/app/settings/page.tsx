"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { AiSettings } from '@/components/settings/AiSettings';
import { NetworkSettings } from '@/components/settings/NetworkSettings';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { Settings, Sliders, Globe } from 'lucide-react';

type TabId = 'general' | 'ai' | 'network';

export default function AppSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const tabItems = [
    { id: 'general' as TabId, label: 'General Configuration', icon: Settings },
    { id: 'ai' as TabId, label: 'AI Synthesis Parameters', icon: Sliders },
    { id: 'network' as TabId, label: 'Environment Proxies', icon: Globe }
  ];

  const handleCommitSave = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    /* 📱 ADAPTIVE WINDOW SPAWNERS: Standardized downward outer layout py-4 px-4 track settings */
    <div className="w-full min-h-screen bg-slate-50 py-4 px-4 sm:py-8 sm:px-10 lg:px-12 animate-in fade-in duration-300 text-slate-900 space-y-4 sm:space-y-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Upper Dashboard Header Title */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:gap-3">
              <span className="p-1.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-800">
                <Settings className="h-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </span> 
              Control Preferences Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl">
              Calibrate system weights, institutional labels, and model baseline thresholds parameters.
            </p>
          </div>

          <button 
            onClick={handleCommitSave}
            className="w-full sm:w-auto h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
          >
            Save All Settings
          </button>
        </div>

        {/* 📱 HORIZONTAL SCROLL SELECTOR: Supports clean touch swiping parameters on phones */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-1.5 pb-0.5 snap-x">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer snap-center ${
                  isActive 
                    ? 'border-slate-900 text-slate-900 bg-white/50 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Inner Active Panel Router Layout */}
        <div className="mt-2 sm:mt-4">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'ai' && <AiSettings />}
          {activeTab === 'network' && <NetworkSettings />}
        </div>

      </div>

      <FeedbackModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        type="success"
        title="Preferences Synchronized"
        message="Your customized core layout configurations have been successfully committed to browser local configuration buffers."
      />

    </div>
  );
}