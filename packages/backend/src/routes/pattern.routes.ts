import { Router } from 'express';
import { Pattern } from '../models/Pattern.js';

const router = Router();

// ➕ POST /api/patterns - Preserves a brand new custom school blueprint template profile
router.post('/', async (req, res) => {
  try {
    const { patternName, subjectDefault, sections } = req.body;
    console.log(`✨ Registering fresh custom layout profile template: "${patternName}"`);

    // Payload verification guards
    if (!patternName || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ error: 'Missing required patternName or dynamic section data definitions.' });
    }

    const newPattern = new Pattern({
      patternName: patternName.trim(),
      subjectDefault: subjectDefault ? subjectDefault.trim() : undefined,
      sections
    });

    await newPattern.save();
    console.log(`✅ Blueprint profile saved successfully into MongoDB with ID: ${newPattern._id}`);
    
    // 💡 FIXED: Uses standard created success response status code code 201
    res.status(201).json(newPattern);
  } catch (error: any) {
    console.error('❌ Mongoose pattern model preservation execution error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A school paper template configuration profile with that exact name already exists.' });
    }
    
    res.status(500).json({ error: 'Internal server error while saving the custom pattern profile configuration.' });
  }
});

// 📋 GET /api/patterns - Extracts all saved template profiles for input configurations fields dropdown layers
router.get('/', async (req, res) => {
  try {
    const savedProfiles = await Pattern.find().sort({ createdAt: -1 });
    res.json(savedProfiles);
  } catch (error) {
    console.error('❌ Failed to fetch pattern blueprints indices rows:', error);
    res.status(500).json({ error: 'Failed to retrieve saved pattern configurations from the database database references.' });
  }
});

// 🗑️ DELETE /api/patterns/:id - Purges a saved layout pattern configuration profile from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Processing structural purge for Pattern Template ID: ${id}`);

    const deletedPattern = await Pattern.findByIdAndDelete(id);

    if (!deletedPattern) {
      return res.status(404).json({ error: 'Target paper pattern configuration profile not found.' });
    }

    console.log(`✅ Pattern template "${deletedPattern.patternName}" successfully scrubbed out.`);
    return res.json({ message: 'Paper pattern profile permanently erased successfully.' });
  } catch (error: any) {
    console.error('❌ Failed to execute pattern profile deletion:', error);
    return res.status(500).json({ error: 'Internal server error while purging the pattern profile.' });
  }
});

export default router;