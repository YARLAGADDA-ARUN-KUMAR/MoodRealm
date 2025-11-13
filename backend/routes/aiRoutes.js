import express from "express";
import {
    generateInspirationalContent,
    chatWithAI,
    generateBackgroundImage,
    generateQuote,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const aiRoutes = express.Router();

aiRoutes.post("/generate", generateQuote);

aiRoutes.post("/generate-content", protect, generateInspirationalContent);

aiRoutes.post("/chat", protect, chatWithAI);

aiRoutes.post("/generate-image", protect, generateBackgroundImage);

export default aiRoutes;
