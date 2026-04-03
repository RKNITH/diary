import express from 'express';
import { getGlobalSummary } from '../controllers/summary.controller.js';

const router = express.Router();

router.get('/', getGlobalSummary); // Public

export default router;
