const express = require('express');
const Knowledge = require('../models/knowledge');
const { getAllKnowledge, getKnowledgeById, addKnowledge, updateKnowledgeById, deleteKnowledgeById, deleteByQuestion } = require('../query/knowQuery');

const router = express.Router();

// GET all knowledge entries
router.get('/', async (req, res) => {
  try {
    const knowledge = await getAllKnowledge();
    res.send(knowledge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single knowledge entry by ID
router.get('/:id', async (req, res) => {
  try {
    const knowledge = await getKnowledgeById(req.params.id);
    if (knowledge == null) {
      return res.status(404).json({ message: 'Cannot find knowledge entry' });
    }
    res.send(knowledge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new knowledge entry
router.post('/', async (req, res) => {
  const knowledge = new Knowledge({
    question: req.body.question,
    answer: req.body.answer
  });

  try {
    const newKnowledge = await addKnowledge(knowledge);
    res.status(201).json(newKnowledge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a knowledge entry
router.patch('/:id', async (req, res) => {
  try {
    const updatedKnowledge = await updateKnowledgeById(req.params.id, req.body);
    res.json(updatedKnowledge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a knowledge entry
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteKnowledgeById(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cannot find knowledge entry' });
    }
    res.json({ message: 'Deleted knowledge entry' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a knowledge entry by question
router.delete('/:question', async (req, res) => {
  try {
    const result = await deleteByQuestion(req.params.question);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cannot find knowledge entry' });
    }
    res.json({ message: `Deleted ${result.deletedCount} knowledge(s) with question "${req.params.question}"` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;