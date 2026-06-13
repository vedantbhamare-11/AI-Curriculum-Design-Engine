import { Router } from 'express';
import multer from 'multer';
// @ts-ignore
import pdfParser from 'pdf-parse-fork'; 
import { Assignment } from '../models/Assignment.js';
import { Pattern } from '../models/Pattern.js'; 
import { VaultMaterial } from '../models/VaultMaterial.js';
import { assessmentQueue } from '../config/queue.js'; 

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
});

// ➕ POST /api/assignments - Intercepts scope configurations, maps grounding files, and spins BullMQ jobs
router.post('/', upload.single('primaryFile'), async (req, res) => {
  try {
    console.log("🚀 Intercepted unified assignment generation parameters...");
    
    let metadata = req.body;
    if (typeof req.body.data === 'string') {
      try {
        metadata = JSON.parse(req.body.data);
      } catch (parseErr) {
        return res.status(400).json({ error: 'Malformed structured data parameter payload string.' });
      }
    }

    const { 
      subject, 
      className, 
      dueDate, 
      additionalInstructions, 
      selectedPatternId, 
      secondaryContextId 
    } = metadata;

    if (!subject || !className || !dueDate || !selectedPatternId) {
      return res.status(400).json({ error: 'Missing mandatory fields. Ensure subject, className, dueDate, and selectedPatternId are provided.' });
    }

    // 1. Fetch Selected Paper Blueprint configuration layout rules out of MongoDB
    const patternDoc = await Pattern.findById(selectedPatternId);
    if (!patternDoc) {
      return res.status(404).json({ error: 'Target exam pattern template definition not found.' });
    }

    // 2. Fetch Selected Textbook Reference Text out of your persistent Context Vault collection
    let secondaryContextText = '';
    if (secondaryContextId) {
      const vaultDoc = await VaultMaterial.findById(secondaryContextId);
      if (vaultDoc) {
        secondaryContextText = vaultDoc.extractedText || '';
      }
    }

    // 3. 🚀 EXTRACTION LAYER: Automatically intercepts text PDFs vs Scanned Image PDFs
    let primaryContextText = '';
    let primaryContextMimeType = '';
    let primaryContextBase64 = '';

    if (req.file) {
      const mime = req.file.mimetype;
      console.log(`📋 Extracting primary reference attachment format: ${mime}`);

      if (mime === 'application/pdf') {
        let parseFn: any = pdfParser;
        if (pdfParser && (pdfParser as any).default) {
          parseFn = (pdfParser as any).default;
        }
        
        try {
          const parsedPdf = await parseFn(req.file.buffer);
          if (parsedPdf && typeof parsedPdf === 'object') {
            primaryContextText = parsedPdf.text || '';
          }
        } catch (pErr) {
          console.warn("⚠️ PDF text extractor stalled. Preparing vision fallback structure...");
        }

        // 💡 THE VISION UPGRADE:
        // If the extracted text layer is empty or contains raw PDF engine metadata syntax code, 
        // we preserve the original layout and pass it as an inline binary vision stream payload.
        if (!primaryContextText || !primaryContextText.trim() || primaryContextText.includes('/FlateDecode') || primaryContextText.includes('/ColorSpace')) {
          console.log("📸 Scanned document layout detected! Packaging file for Gemini Vision processing...");
          primaryContextBase64 = req.file.buffer.toString('base64');
          primaryContextMimeType = 'application/pdf';
          primaryContextText = "[Scanned Multimodal Document Stream Payload Dynamic Target]";
        }

      } else {
        // Fallback for plain text standard files (.txt, .md, .json)
        primaryContextText = req.file.buffer.toString('utf8');
      }

      // Keep text-based content string sizes bounded tightly safely under budget limits
      if (primaryContextText.length > 40000 && !primaryContextBase64) {
        primaryContextText = primaryContextText.substring(0, 40000) + "\n\n...[Primary context truncated for token thresholds]";
      }
    }

    // 4. Pre-calculate metrics totals out of the custom blueprint sections arrays mapping rules
    const totalQuestions = patternDoc.sections.reduce((acc, curr) => acc + curr.questionCount, 0);
    const totalMarks = patternDoc.sections.reduce((acc, curr) => acc + (curr.questionCount * curr.marksPerQuestion), 0);

    // 5. Build and save the baseline pending tracking document into your database collection
    const newAssignment = new Assignment({
      subject,
      className,
      dueDate: new Date(dueDate),
      totalQuestions,
      totalMarks,
      additionalInstructions,
      status: 'pending',
      sections: [],
      answerKey: []
    });
    await newAssignment.save();

    // 6. Enqueue task parameters directly inside your active Redis assessmentQueue
    const job = await assessmentQueue.add('assessmentGeneration', {
      assignmentId: newAssignment._id,
      subject,
      className,
      additionalInstructions,
      blueprintSections: patternDoc.sections,
      primaryContext: primaryContextText, 
      secondaryContext: secondaryContextText,
      // 💡 NEW FIELDS: Ships the image variables natively along the queue line channel
      primaryContextBase64: primaryContextBase64 || null,
      primaryContextMimeType: primaryContextMimeType || null
    }, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 25000 
      }
    });

    console.log(`✅ Assignment registered successfully under ID: ${newAssignment._id}. Job ${job.id} dispatched.`);

    return res.status(202).json({ 
      assignmentId: newAssignment._id, 
      jobId: job.id, 
      message: 'Background worker generation pipeline successfully initialized!' 
    });

  } catch (error: any) {
    console.error('❌ Pipeline initialization failed:', error);
    return res.status(500).json({ error: error.message || 'Pipeline generation engine collapsed.' });
  }
});

// 📋 GET /api/assignments - Pulls index history catalog cleanly
router.get('/', async (req, res) => {
  try {
    const historyList = await Assignment.find()
      .sort({ createdAt: -1 })
      .select('-__v'); 
    return res.json(historyList);
  } catch (error: any) {
    console.error('❌ MongoDB assignment index read crashed:', error);
    return res.status(500).json({ error: 'Failed to retrieve stored assessments repository.' });
  }
});

// 🔍 GET /api/assignments/:id - Core execution status verification endpoint called by your frontend polling hook
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }
    return res.json(assignment);
  } catch (error) {
    console.error('❌ Individual assessment extraction failed:', error);
    return res.status(500).json({ error: 'Error reading item metadata profile out of database blocks.' });
  }
});

// 🗑️ DELETE /api/assignments/:id - Removes a document permanently from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ error: 'Assignment record not found.' });
    }
    return res.json({ message: 'Assignment permanently deleted successfully.' });
  } catch (error: any) {
    console.error('❌ Assignment deletion sequence crashed:', error);
    return res.status(500).json({ error: 'Failed to delete assignment record from the database.' });
  }
});

export default router;