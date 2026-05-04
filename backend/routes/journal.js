const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const { protect } = require('../middleware/auth');
const socketEmitter = require('../socket'); 

// CREATE
router.post('/', protect, async (req, res) => {
  try {
    const { title, body, mood, verseRef, isPrivate } = req.body;
    const journal = await Journal.create({
      userId: req.user._id, title, body, mood, verseRef, isPrivate
    });

   
    socketEmitter.emit('activity:new', {
      name: req.user.name,
      action: mood
        ? `is journaling — "${title || 'Untitled'}" (${mood})`
        : `wrote a journal entry`,
      icon: '📝',
      timestamp: new Date().toISOString()
    });

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ all (current user only)
router.get('/', protect, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ one
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Not found' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;