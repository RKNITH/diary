import express from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // Use via Postman only for initial admin setup
router.get('/me', protect, getMe);

export default router;
