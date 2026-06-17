import { Schema, model, Document } from 'mongoose';

export interface IVaultMaterial extends Document {
  title: string;
  description: string;
  subject: string;
  fileMimeType?: string;        // e.g., "application/pdf"
  fileSizeText: string;        // e.g., "4.82 MB"
  extractedText?: string;       // Holds truncated plain text for prompt grounding
  fileBuffer?: Buffer;          // 💡 NEW: Stores raw binary properties to display PDFs in-app
  createdAt: Date;
  updatedAt: Date;
}

const VaultMaterialSchema = new Schema<IVaultMaterial>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  fileMimeType: { type: String },
  fileSizeText: { type: String, required: true },
  extractedText: { type: String },
  fileBuffer: { type: Buffer }  // 💡 NEW: Map binary fields to document schema metrics
}, { timestamps: true });

export const VaultMaterial = model<IVaultMaterial>('VaultMaterial', VaultMaterialSchema);