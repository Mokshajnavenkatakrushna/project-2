const express = require('express');
const SoilAnalysis = require('../models/SoilAnalysis');
const router = express.Router();

// Create new soil analysis
router.post('/', async (req, res) => {
  try {
    const { userId, nitrogen, phosphorus, potassium, pH, moisture, status, recommendations, cropSuggestions, location, notes } = req.body;

    // Validate required fields
    if (!userId || nitrogen === undefined || phosphorus === undefined || potassium === undefined || pH === undefined || moisture === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const soilAnalysis = new SoilAnalysis({
      userId,
      nitrogen,
      phosphorus,
      potassium,
      pH,
      moisture,
      status,
      recommendations: recommendations || [],
      cropSuggestions: cropSuggestions || [],
      location: location || '',
      notes: notes || ''
    });

    await soilAnalysis.save();
    res.status(201).json(soilAnalysis);
  } catch (error) {
    console.error('Error creating soil analysis:', error);
    res.status(500).json({ error: 'Failed to save soil analysis' });
  }
});

// Get all soil analyses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const analyses = await SoilAnalysis.find({ userId }).sort({ date: -1 });
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching soil analyses:', error);
    res.status(500).json({ error: 'Failed to fetch soil analyses' });
  }
});

// Get single soil analysis
router.get('/:id', async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Soil analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching soil analysis:', error);
    res.status(500).json({ error: 'Failed to fetch soil analysis' });
  }
});

// Update soil analysis
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const analysis = await SoilAnalysis.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Soil analysis not found' });
    }
    
    res.json(analysis);
  } catch (error) {
    console.error('Error updating soil analysis:', error);
    res.status(500).json({ error: 'Failed to update soil analysis' });
  }
});

// Delete soil analysis
router.delete('/:id', async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findByIdAndDelete(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Soil analysis not found' });
    }
    res.json({ message: 'Soil analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting soil analysis:', error);
    res.status(500).json({ error: 'Failed to delete soil analysis' });
  }
});

module.exports = router;
