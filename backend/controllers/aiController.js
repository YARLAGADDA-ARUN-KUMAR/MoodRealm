import { GoogleGenAI } from '@google/genai';
import asyncHandler from 'express-async-handler';

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const buildTextContent = (text, role = 'user') => ({
    role,
    parts: [{ text }],
});

const getTextFromResponse = (response) => response?.text?.trim();

const generateInspirationalContent = asyncHandler(async (req, res) => {
    const { mood, contentType } = req.body;

    if (!mood || !contentType) {
        return res.status(400).json({ message: 'Mood and content type are required' });
    }

    const prompt = [
        'You are MoodRealm, an AI that generates emotional and inspirational content.',
        'The response must be unique, creative, and inspiring.',
        '- For "Quote", "Flirty Line", or "Life Lesson", reply with one or two sentences.',
        '- For "Story" or "Poem", a few short paragraphs are acceptable.',
        '- Respond with the generated text only. No quotation marks or attributions.',
        '',
        `Mood: ${mood}`,
        `Content Type: ${contentType}`,
    ].join('\n');

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_GEMINI_MODEL,
            contents: [buildTextContent(prompt)],
        });

        const text = getTextFromResponse(response);
        if (!text) {
            throw new Error('Gemini response did not include text');
        }

        res.json({ content: text });
    } catch (error) {
        console.error('Gemini content generation error:', error);
        res.status(500).json({ message: 'Failed to generate AI content' });
    }
});

const chatWithAI = asyncHandler(async (req, res) => {
    const { history = [], newMessage } = req.body;

    if (!newMessage) {
        return res.status(400).json({ message: 'New message is required' });
    }

    const systemInstruction =
        'You are SoulBot, a compassionate and supportive AI companion. Respond with empathy, encouragement, and concise guidance.';

    const sanitizedHistory = history
        .filter((msg) => msg?.content)
        .map((msg) => buildTextContent(msg.content, msg.role === 'assistant' ? 'model' : 'user'));

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_GEMINI_MODEL,
            contents: [
                buildTextContent(systemInstruction),
                ...sanitizedHistory,
                buildTextContent(newMessage),
            ],
        });

        const text = getTextFromResponse(response);
        if (!text) {
            throw new Error('Gemini response did not include text');
        }

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini chat error:', error);
        res.status(500).json({ message: 'Failed to get AI chat response' });
    }
});

const generateQuote = asyncHandler(async (req, res) => {
    const { mood, category } = req.body;

    if (!mood || !category) {
        return res.status(400).json({ message: 'Mood and category are required' });
    }

    const prompt = `Generate one short and creative ${category} quote tailored for someone feeling ${mood}. Respond with the quote only.`;

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_GEMINI_MODEL,
            contents: [buildTextContent(prompt)],
        });

        const text = getTextFromResponse(response);
        if (!text) {
            throw new Error('Gemini response did not include text');
        }

        res.json({ quote: text });
    } catch (error) {
        console.error('Gemini quote error:', error);
        res.status(500).json({ message: 'Failed to generate quote' });
    }
});

export { chatWithAI, generateInspirationalContent, generateQuote };
