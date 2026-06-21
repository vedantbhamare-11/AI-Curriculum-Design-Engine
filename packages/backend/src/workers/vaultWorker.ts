// packages/backend/src/workers/vaultWorker.ts
import { Worker, Job } from 'bullmq';
import zlib from 'zlib';
// @ts-ignore
import pdfParser from 'pdf-parse-fork';
import { VaultMaterial } from '../models/VaultMaterial.js';
import { connection } from '../config/queue.js';

export const initVaultWorker = () => {
  const vaultWorker = new Worker(
    'vaultIngestion',
    async (job: Job) => {
      const { materialId, fileBufferBase64, originalMimeType, title, description } = job.data;

      try {
        console.log(`👷 Worker pulling Vault Job ${job.id} for Material ID: ${materialId}`);

        const fileBuffer = Buffer.from(fileBufferBase64, 'base64');
        let extractedPayloadText = '';

        if (originalMimeType === 'application/pdf') {
          console.log(`📋 Background processing heavy PDF parsing for: ${title}`);
          let parseFn: any = pdfParser;
          if (pdfParser && (pdfParser as any).default) {
            parseFn = (pdfParser as any).default;
          }

          const parsedPdfData = await parseFn(fileBuffer);
          extractedPayloadText = parsedPdfData.text || '';
        } else if (
          originalMimeType === 'text/plain' || 
          originalMimeType === 'text/markdown' || 
          originalMimeType === 'application/json'
        ) {
          extractedPayloadText = fileBuffer.toString('utf8');
        } else {
          extractedPayloadText = `Document Reference Profile: ${title.trim()}\nSummary Constraints: ${description.trim()}`;
        }

        // Limit truncation to save token quota tiers
        if (extractedPayloadText.length > 40000) {
          extractedPayloadText = extractedPayloadText.substring(0, 40000) + "\n\n...[Truncated to safeguard token quota tiers]";
        }

        console.log(`🗜️ Compressing extracted content structures...`);
        const safeCompressedBuffer = zlib.gzipSync(fileBuffer);

        // Update the placeholder document inside MongoDB Atlas with the rich parsed text!
        await VaultMaterial.findByIdAndUpdate(materialId, {
          extractedText: extractedPayloadText,
          fileBuffer: safeCompressedBuffer
        });

        console.log(`✅ Vault material entry ${materialId} successfully completed parsing in background thread.`);
        return { success: true };

      } catch (err: any) {
        console.error(`❌ Vault Extraction Worker Pipeline crashed on Job ${job.id}:`, err);
        await VaultMaterial.findByIdAndUpdate(materialId, {
          extractedText: `⚠️ Ingest Pipeline background extraction failed: ${err.message || 'Unknown processing breakdown.'}`
        });
        throw err;
      }
    },
    {
      connection: connection as any,
      concurrency: 1 // Single concurrency blocks simultaneous spikes to protect your 512MB RAM tier
    }
  );

  console.log("👷 Background Vault Ingestion Worker successfully spawned.");
};