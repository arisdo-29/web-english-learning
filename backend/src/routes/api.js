const express = require('express');
const router = express.Router();

const exerciseController = require('../controllers/exerciseController');
const progressController = require('../controllers/progressController');
const notebookController = require('../controllers/notebookController');
const aiController = require('../controllers/aiController');
const { db } = require('../config/database');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: db.isPostgres() ? 'PostgreSQL (Cloud Supabase/Neon)' : 'Local JSON Persistent Database',
    timestamp: new Date().toISOString()
  });
});

// Exercises
router.get('/exercises/passages', exerciseController.getPassages);
router.get('/exercises/vocab', exerciseController.getVocab);
router.get('/exercises/sentences', exerciseController.getSentences);
router.get('/exercises/blanks', exerciseController.getBlanks);
router.get('/exercises/placement-test', exerciseController.getPlacementTest);
router.post('/exercises/placement-test/submit', exerciseController.submitPlacementTest);
router.post('/exercises/grade-local', exerciseController.gradeTranslationLocal);

// Progress & Dashboard
router.get('/progress/dashboard', progressController.getDashboard);
router.post('/progress/record', progressController.recordPoints);
router.post('/progress/reset', progressController.resetStats);
router.get('/progress/settings', progressController.getSettings);
router.put('/progress/settings', progressController.updateSettings);

// Notebook (Từ cần ôn & Lỗi ghi chép)
router.get('/notebook/words', notebookController.getWords);
router.post('/notebook/words', notebookController.addWord);
router.delete('/notebook/words', notebookController.removeWord);
router.post('/notebook/words/clear', notebookController.clearWords);

router.get('/notebook/notes', notebookController.getNotes);
router.post('/notebook/notes', notebookController.addNote);
router.post('/notebook/notes/clear', notebookController.clearNotes);

// Custom Passages
router.get('/custom-passages', notebookController.getCustomPassages);
router.post('/custom-passages', notebookController.addCustomPassage);
router.post('/custom-passages/clear', notebookController.clearCustomPassages);

// AI Proxies
router.post('/ai/chat', aiController.chat);
router.post('/ai/grade-translation', aiController.gradeTranslation);

module.exports = router;
