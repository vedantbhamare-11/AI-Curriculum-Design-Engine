// packages/backend/src/routes/vault.ts
import { Router } from 'express';
import multer from 'multer';
import { Queue } from 'bullmq';
import { VaultMaterial } from '../models/VaultMaterial.js';
import { connection } from '../config/queue.js';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
});

// Initialize our background Vault Queue handler linking Upstash Redis
const vaultQueue = new Queue('vaultIngestion', { connection: connection as any });

// ➕ POST /api/vault - Accepts files instantly and shifts parsing to background queue arrays
router.post('/', upload.single('vaultFile'), async (req, res) => {
  try {
    console.log("📥 Receiving live multipart frame allocation pass inside Vault endpoint...");
    
    let bodyData = req.body;
    if (typeof req.body.data === 'string') {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid stringified JSON data payload context.' });
      }
    }

    const { title, description, subject } = bodyData;

    if (!title || !description || !subject) {
      return res.status(400).json({ error: 'Missing title, description, or subject fields.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Missing active textbook/syllabus source payload file asset.' });
    }

    const bytes = req.file.size;
    const fileSizeText = bytes > 1024 * 1024 
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` 
      : `${(bytes / 1024).toFixed(0)} KB`;

    // 1. Create a placeholder document instantly inside MongoDB Atlas with a pending string status frame
    const placeholderMaterial = new VaultMaterial({
      title: title.trim(),
      description: description.trim(),
      subject,
      fileMimeType: req.file.mimetype,
      fileSizeText,
      extractedText: "🔍 Processing asynchronous document line indexing workflows in cloud background queues...",
      fileBuffer: undefined // Filled securely by background worker thread array after compilation loops wrap
    });

    await placeholderMaterial.save();
    console.log(`📝 Placeholder row initialized. Offloading heavy file parse tasks onto BullMQ layer...`);

    // Convert memory buffer allocations into transportable base64 strings
    const fileBufferBase64 = req.file.buffer.toString('base64');
    
    // 2. 🚀 RESILIENT QUEUE CONFIGURATION: Offload file parameters straight onto Upstash Redis cluster queues
    await vaultQueue.add('extractText', {
      materialId: placeholderMaterial._id,
      fileBufferBase64,
      originalMimeType: req.file.mimetype,
      title: title.trim(),
      description: description.trim()
    }, {
      attempts: 3,                 // 🔄 If Render crashes mid-job due to RAM limits, automatically retry up to 3 times
      backoff: {
        type: 'fixed',
        delay: 15000               // ⏱️ Wait 15 seconds before trying again to let the container clear its memory footprint
      },
      removeOnComplete: true,      // Clean up background cache keys on job success
      removeOnFail: false          // Keep failed logs visible inside your logging cluster for inspection
    });

    // 3. Immediately return status 202 (Accepted) to the browser! Takes less than 200ms—CORS network block avoided.
    return res.status(202).json(placeholderMaterial);

  } catch (error: any) {
    console.error('❌ Failed to route ingestion parameters:', error);
    return res.status(500).json({ error: error.message || 'Failed to initialize ingestion pipeline processing parameters.' });
  }
});

// 📋 GET /api/vault - Retrieves master library index
router.get('/', async (req, res) => {
  try {
    const catalog = await VaultMaterial.find().sort({ createdAt: -1 }).select('-extractedText -fileBuffer');
    return res.json(catalog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to extract library indexes.' });
  }
});

// 🔍 GET /api/vault/:id - Pulls complete document records on demand
router.get('/:id', async (req, res) => {
  try {
    const material = await VaultMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Vault reference material entry not found.' });
    }

    const responsePayload: any = material.toObject();
    if (material.fileBuffer) {
      try {
        // Dynamic conditional runtime extraction preventing bundle compilation crashes
        const zlibModule = await import('zlib');
        const unzippedBuffer = zlibModule.default.gunzipSync(material.fileBuffer);
        responsePayload.fileBufferBase64 = unzippedBuffer.toString('base64');
      } catch (zipErr) {
        responsePayload.fileBufferBase64 = material.fileBuffer.toString('base64');
      }
      delete responsePayload.fileBuffer;
    }

    return res.json(responsePayload);
  } catch (error) {
    console.error('❌ Individual document lookup crashed:', error);
    return res.status(500).json({ error: 'Failed to extract rich material file data profiles.' });
  }
});

// 🗑️ DELETE /api/vault/:id - Removes a document record permanently from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ Processing deletion request for Vault ID: ${req.params.id}`);
    const deletedMaterial = await VaultMaterial.findByIdAndDelete(req.params.id);
    
    if (!deletedMaterial) {
      return res.status(404).json({ error: 'Target reference document not found.' });
    }
    
    return res.json({ message: 'Reference document permanently purged from the vault successfully.' });
  } catch (error: any) {
    console.error('❌ Failed to delete reference asset:', error);
    return res.status(500).json({ error: 'Failed to delete vault reference material from the database.' });
  }
});

export default router;