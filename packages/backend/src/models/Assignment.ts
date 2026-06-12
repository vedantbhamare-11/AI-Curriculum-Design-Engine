import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[]; // Array of strings for Multiple Choice option strings
}

export interface IAnswerItem {
  questionNumber: number;
  answerText: string;
}

export interface IAssignment extends Document {
  schoolName: string;
  subject: string;
  className: string;
  dueDate: Date;
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  
  // 💡 NEW FIELDS FOR PRODUCT ARCHITECTURE PIVOT
  patternId?: Schema.Types.ObjectId;         // Link to the saved customizable blueprint profile
  primaryContextText?: string;               // $1st priority: text extracted from uploaded temporary class notes
  secondaryContextId?: string;               // $2nd priority: linked document ID from your reference book vault
  
  fileUrl?: string; 
  referenceFileMimeType?: string; // Tracks uploaded reference mimeType context (e.g., application/pdf)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  aiIntroGreeting?: string; 
  sections: {
    sectionLetter: string; 
    sectionType: string;   
    instruction: string;   
    questions: IQuestion[];
  }[];
  answerKey: IAnswerItem[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
  marks: { type: Number, required: true },
  options: [{ type: String }] // Populated dynamically when sectionType is MCQs
});

const AnswerItemSchema = new Schema<IAnswerItem>({
  questionNumber: { type: Number, required: true },
  answerText: { type: String, required: true }
});

const AssignmentSchema = new Schema<IAssignment>({
  schoolName: { type: String, default: 'Delhi Public School, Sector-4, Bokaro' },
  subject: { type: String, required: true },
  className: { type: String, required: true },
  dueDate: { type: Date, required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  additionalInstructions: { type: String },
  
  // 💡 TRACKING INJECTORS REGISTERED IN MONGOOSE SCHEMA
  patternId: { type: Schema.Types.ObjectId, ref: 'Pattern' },
  primaryContextText: { type: String },
  secondaryContextId: { type: String },
  
  fileUrl: { type: String }, 
  referenceFileMimeType: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  jobId: { type: String },
  aiIntroGreeting: { type: String },
  sections: [{
    sectionLetter: { type: String, required: true },
    sectionType: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [QuestionSchema]
  }],
  answerKey: [AnswerItemSchema]
}, { timestamps: true });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);