import express from 'express';
import {
    chatWithAI,
    clearChatHistory,
    generateInspirationalContent,
    getChatHistory,
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const aiRoutes = express.Router();

aiRoutes.post('/generate-content', protect, generateInspirationalContent);
aiRoutes.post('/chat', protect, chatWithAI);
aiRoutes.get('/chat/history', protect, getChatHistory);
aiRoutes.delete('/chat/history', protect, clearChatHistory);

export default aiRoutes;
