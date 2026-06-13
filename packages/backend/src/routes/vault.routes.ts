import { Router } from 'express';
import multer from 'multer';
// @ts-ignore - Tells the TypeScript compiler to skip type checking for this un-typed module import
import pdfParser from 'pdf-parse-fork'; 
import { VaultMaterial } from '../models/VaultMaterial.js';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Safely handles up to 50MB files
});

// ➕ POST /api/vault - Intercepts textbooks/syllabi and converts text/PDF files into clean prompt blocks
router.post('/', upload.single('vaultFile'), async (req, res) => {
  try {
    console.log("📥 Archiving reference asset into Vault...");
    
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

    const bytes = req.file?.size || 0;
    const fileSizeText = bytes > 1024 * 1024 
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` 
      : `${(bytes / 1024).toFixed(0)} KB`;

    let extractedPayloadText = '';

    if (req.file) {
      const mime = req.file.mimetype;
      console.log(`📋 Processing live stream for format: ${mime}`);

      if (mime === 'application/pdf') {
        // Robust polymorph execution handling to guarantee smooth buffer conversion
        let parseFn: any = pdfParser;
        if (pdfParser && (pdfParser as any).default) {
          parseFn = (pdfParser as any).default;
        }

        const parsedPdfData = await parseFn(req.file.buffer);
        extractedPayloadText = parsedPdfData.text || '';
      } else if (mime === 'text/plain' || mime === 'text/markdown' || mime === 'application/json') {
        extractedPayloadText = req.file.buffer.toString('utf8');
      } else {
        extractedPayloadText = `Document Reference Profile: ${title.trim()}\nSummary Constraints: ${description.trim()}`;
      }
    }

    // 💡 FIXED OPTIMIZED TOKEN-BUDGET GUARD: 
    // Truncates text at 40,000 characters (~10k tokens) to prevent 429 RESOURCE_EXHAUSTED errors on the free tier.
    if (extractedPayloadText.length > 40000) {
      extractedPayloadText = extractedPayloadText.substring(0, 40000) + "\n\n...[Truncated to safeguard minute token quota tiers]";
    }

    const newMaterial = new VaultMaterial({
      title: title.trim(),
      description: description.trim(),
      subject,
      fileMimeType: req.file?.mimetype || 'application/pdf',
      fileSizeText,
      extractedText: extractedPayloadText 
    });

    await newMaterial.save();
    console.log(`✅ Rich content parsed and stored under ID: ${newMaterial._id}`);
    
    return res.status(201).json(newMaterial);
  } catch (error: any) {
    console.error('❌ Failed to extract file details:', error);
    return res.status(500).json({ error: 'Failed to extract plain text parameters from document stream.' });
  }
});

// 📋 GET /api/vault - Retrieves master library index (Excludes heavy strings for snappier UI list views)
router.get('/', async (req, res) => {
  try {
    const catalog = await VaultMaterial.find().sort({ createdAt: -1 }).select('-extractedText');
    return res.json(catalog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to extract library indexes.' });
  }
});

// 🔍 GET /api/vault/:id - Pulls complete document records including heavy text contexts on demand
router.get('/:id', async (req, res) => {
  try {
    const material = await VaultMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Vault reference material entry not found.' });
    }
    return res.json(material);
  } catch (error) {
    console.error('❌ Individual document lookup crashed:', error);
    return res.status(500).json({ error: 'Failed to extract rich material file data profiles.' });
  }
});

export default router;