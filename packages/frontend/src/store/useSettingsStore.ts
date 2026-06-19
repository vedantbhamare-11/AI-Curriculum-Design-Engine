import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  // Institutional Hierarchy
  schoolName: string;
  departmentName: string; // e.g., Science, Mathematics, Humanities
  teacherName: string;
  teacherId: string;      // Staff registration token placeholder
  
  // Class & Exam Blueprint Defaults
  defaultInstructions: string;
  gradingScale: string;
  
  // AI Inference Constraints
  selectedModel: string;
  temperature: number;
  maxTokens: number;

  // Actions
  updateSettings: (fields: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Hierarchical Layout Defaults
      schoolName: 'Aero Academy International',
      departmentName: 'Department of Science',
      teacherName: 'Prof. Vedant Bhamare',
      teacherId: 'STAFF-2026-094',
      
      defaultInstructions: 'All questions are compulsory. Use of scientific calculators is permitted unless specified otherwise.',
      gradingScale: 'Percentage (A-F Standard)',
      
      selectedModel: 'gemini-2.5-flash',
      temperature: 0.3,
      maxTokens: 2048,

      updateSettings: (fields) => set((state) => ({ ...state, ...fields })),
      
      resetSettings: () => set({
        schoolName: 'Aero Academy International',
        departmentName: 'Department of Science',
        teacherName: 'Prof. Vedant Bhamare',
        teacherId: 'STAFF-2026-094',
        defaultInstructions: 'All questions are compulsory. Use of scientific calculators is permitted unless specified otherwise.',
        gradingScale: 'Percentage (A-F Standard)',
        selectedModel: 'gemini-2.5-flash',
        temperature: 0.3,
        maxTokens: 2048
      })
    }),
    {
      name: 'aeropaper-institutional-settings', // Refreshed storage key boundary
    }
  )
);