import express from "express";
import generateQuote from "../controllers/aiController.js";

const aiRoutes = express.Router();
aiRoutes.post("/generate", generateQuote);

export default aiRoutes;
