import express from 'express';
import {
    chatWithAI,
    generateInspirationalContent,
    generateQuote,
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const aiRoutes = express.Router();

aiRoutes.post('/generate', generateQuote);

aiRoutes.post('/generate-content', protect, generateInspirationalContent);

aiRoutes.post('/chat', protect, chatWithAI);

export default aiRoutes;
