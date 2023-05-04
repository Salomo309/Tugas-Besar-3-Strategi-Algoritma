const express = require('express');
const Knowledge = require('../models/knowledge');
const { getAllKnowledge, getKnowledgeById, getKnowledgeByQuestion, addKnowledge, updateKnowledgeByQuestion, deleteKnowledgeById, deleteByQuestion, isQuestionExist, getAllQuestions,
  getAllAnswers,
  getQuestionAndAnswer } = require('../query/knowQuery');

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

// GET a single knowledge entry by Question
router.get('/:question', async (req, res) => {
    try {
      const knowledge = await getKnowledgeByQuestion(req.params.question);
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
router.patch('/:question', async (req, res) => {
  try {
    const updatedKnowledge = await updateKnowledgeByQuestion(req.params.question, req.params.answer);
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

router.post('/', async (req, res) => {
  const question = req.body.question;
  const isExist = await isQuestionExist(question);
  if (isExist) {
    return res.status(400).json({ message: 'Question already exists' });
  } else {
    return res.status(404).json({ message: 'Question not found in database' });
  }
});

// GET all question
router.get('/', async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.send(questions);
  } catch (err) {
  res.status(500).json({ message: err.message });
  }
});

// GET all knowledge answers
router.get('/', async (req, res) => {
  try {
    const answers = await getAllAnswers();
    res.send(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET data (question and answer)
router.get('/', async (req, res) => {
  try {
    const data = await getQuestionAndAnswer();
    res.send(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
