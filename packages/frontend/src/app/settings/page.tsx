"use JSX";
'use client';

import React, { useState } from 'react';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { AiSettings } from '@/components/settings/AiSettings';
import { NetworkSettings } from '@/components/settings/NetworkSettings';
import { FeedbackModal } from '@/components/vault/FeedbackModal';
import { Settings, Sliders, Cpu, Globe } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 animate-in fade-in duration-300 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Upper Dashboard Header Title */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:text-2xl">
              <Settings className="h-6 w-6 text-indigo-600" /> Control Preferences Matrix
            </h1>
            <p className="text-sm text-slate-600 font-semibold">
              Calibrate system weights, institutional labels, and model baseline thresholds.
            </p>
          </div>

          <button 
            onClick={handleCommitSave}
            className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Save All Settings
          </button>
        </div>

        {/* Tab Selection Row Menu */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-11 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600 bg-white/40' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Inner Active Panel Router Layout */}
        <div className="mt-4">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'ai' && <AiSettings />}
          {activeTab === 'network' && <NetworkSettings />}
        </div>

      </div>

      {/* Reusable Success Confirmation System Popout */}
      <FeedbackModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        type="success"
        title="Preferences Synchronized"
        message="Your customized core layout configurations have been successfully committed to local browser persistent storage buffers."
      />

    </div>
  );
}