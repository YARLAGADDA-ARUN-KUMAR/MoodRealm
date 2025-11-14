import express from 'express';
import {
    chatWithAI,
    clearChatHistory,
    generateInspirationalContent,
    getChatHistory,
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';
import {
    chatWithAIRules,
    generateInspirationalContentRules,
    validate,
} from '../middleware/validationMiddleware.js';

const aiRoutes = express.Router();

aiRoutes.post(
    '/generate-content',
    protect,
    generateInspirationalContentRules(),
    validate,
    generateInspirationalContent,
);
aiRoutes.post('/chat', protect, chatWithAIRules(), validate, chatWithAI);
aiRoutes.get('/chat/history', protect, getChatHistory);
aiRoutes.delete('/chat/history', protect, clearChatHistory);

export default aiRoutes;
