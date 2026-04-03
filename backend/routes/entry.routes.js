import express from 'express';
import {
  getEntriesByDiary,
  updateEntry,
  bulkUpdateEntries,
} from '../controllers/entry.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/diary/:diaryId', getEntriesByDiary);                        // Public
router.put('/:id', protect, updateEntry);                                 // Admin only
router.put('/diary/:diaryId/bulk', protect, bulkUpdateEntries);           // Admin only

export default router;
