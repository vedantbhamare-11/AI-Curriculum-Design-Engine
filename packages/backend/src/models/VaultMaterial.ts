import { Schema, model, Document } from 'mongoose';

export interface IVaultMaterial extends Document {
  title: string;
  description: string;
  subject: string;
  fileUrl?: string;            // Location path descriptor on disk/cloud storage
  fileMimeType?: string;        // e.g., "application/pdf"
  fileSizeText: string;        // e.g., "4.82 MB"
  extractedText?: string;       // Holds full raw text chunk for secondary prompt grounding
  createdAt: Date;
  updatedAt: Date;
}

const VaultMaterialSchema = new Schema<IVaultMaterial>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String },
  fileMimeType: { type: String },
  fileSizeText: { type: String, required: true },
  extractedText: { type: String }
}, { timestamps: true });

export const VaultMaterial = model<IVaultMaterial>('VaultMaterial', VaultMaterialSchema);