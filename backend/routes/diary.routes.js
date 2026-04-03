import express from 'express';
import {
  getAllDiaries,
  getDiaryById,
  createDiary,
  updateDiary,
  deleteDiary,
} from '../controllers/diary.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllDiaries);            // Public
router.get('/:id', getDiaryById);         // Public

router.post('/', protect, createDiary);           // Admin only
router.put('/:id', protect, updateDiary);         // Admin only
router.delete('/:id', protect, deleteDiary);      // Admin only

export default router;
