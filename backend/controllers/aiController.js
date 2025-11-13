import { GoogleGenAI } from "@google/genai";
import asyncHandler from "express-async-handler";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateQuote = asyncHandler(async (req, res) => {
    const { mood, category } = req.body;
    const prompt = `Generate a single lined unique, short, and creative ${category} quote for someone feeling ${mood}.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
    });

    const text = response.text;

    res.json({ quote: text });
});

export default generateQuote;
