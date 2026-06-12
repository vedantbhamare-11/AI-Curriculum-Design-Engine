import { Schema, model, Document } from 'mongoose';

export interface IPatternSection {
  sectionLetter: string;
  sectionType: string;       // e.g., "Case-Based Assertion-Reasoning", "MCQs"
  instruction: string;       // e.g., "Read the passage carefully and select..."
  questionCount: number;
  marksPerQuestion: number;
  aiGuidelines?: string;     // 💡 Few-shot examples or prompt guidelines for the AI
}

export interface IPattern extends Document {
  patternName: string;       // e.g., "Class 10 CBSE Science Term-1 Template"
  subjectDefault?: string;   // Fallback subject binding
  sections: IPatternSection[];
  createdAt: Date;
  updatedAt: Date;
}

const PatternSectionSchema = new Schema<IPatternSection>({
  sectionLetter: { type: String, required: true },
  sectionType: { type: String, required: true },
  instruction: { type: String, required: true },
  questionCount: { type: Number, required: true },
  marksPerQuestion: { type: Number, required: true },
  aiGuidelines: { type: String }
});

const PatternSchema = new Schema<IPattern>({
  patternName: { type: String, required: true, unique: true },
  subjectDefault: { type: String },
  sections: [PatternSectionSchema]
}, { timestamps: true });

export const Pattern = model<IPattern>('Pattern', PatternSchema);