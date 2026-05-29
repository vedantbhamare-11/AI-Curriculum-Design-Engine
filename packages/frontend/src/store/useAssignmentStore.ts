import { create } from 'zustand';

export interface QuestionConfig {
  type: string;
  count: number;
  marksPerQuestion: number;
}

export interface AssignmentState {
  // Navigation Step Tracker
  currentStep: number;
  
  // Form State Values
  subject: string;
  className: string;
  dueDate: string;
  additionalInstructions: string;
  questionConfigs: QuestionConfig[];
  
  // Asynchronous API Tracker State
  assignmentId: string | null;
  jobId: string | null;
  generationStatus: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper: any | null;

  // Actions / State Setters
  setStep: (step: number) => void;
  updateFormFields: (fields: Partial<Omit<AssignmentState, 'questionConfigs'>>) => void;
  setQuestionConfigs: (configs: QuestionConfig[]) => void;
  resetStore: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  currentStep: 1,
  subject: '',
  className: '',
  dueDate: '',
  additionalInstructions: '',
  questionConfigs: [
    { type: 'Multiple Choice Questions', count: 5, marksPerQuestion: 1 },
    { type: 'Short Questions', count: 3, marksPerQuestion: 2 }
  ],
  assignmentId: null,
  jobId: null,
  generationStatus: 'idle',
  generatedPaper: null,

  setStep: (step) => set({ currentStep: step }),
  
  updateFormFields: (fields) => set((state) => ({ ...state, ...fields })),
  
  setQuestionConfigs: (configs) => set({ questionConfigs: configs }),
  
  resetStore: () => set({
    currentStep: 1,
    subject: '',
    className: '',
    dueDate: '',
    additionalInstructions: '',
    questionConfigs: [
      { type: 'Multiple Choice Questions', count: 5, marksPerQuestion: 1 },
      { type: 'Short Questions', count: 3, marksPerQuestion: 2 }
    ],
    assignmentId: null,
    jobId: null,
    generationStatus: 'idle',
    generatedPaper: null
  })
}));