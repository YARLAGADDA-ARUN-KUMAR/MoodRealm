import { GoogleGenAI } from '@google/genai';
import asyncHandler from 'express-async-handler';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInspirationalContent = asyncHandler(async (req, res) => {
    const { mood, contentType } = req.body;

    if (!mood || !contentType) {
        res.status(400);
        throw new Error('Mood and content type are required');
    }

    const prompt = `
        System: You are MoodRealm, an AI that generates emotional and inspirational content.
        The user wants a piece of content for the following parameters:
        Mood: ${mood}
        Type: ${contentType}

        Generate a unique, creative, and inspiring piece of content.
        - For "Quote", "Flirty Line", or "Life Lesson", keep it to one or two sentences.
        - For "Story" or "Poem", it can be a few paragraphs long.
        - Your response should be ONLY the generated text. Do not include quotation marks, attributions (like "- SoulSpark"), or any other surrounding text.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
        });

        const text = response.text;

        res.json({ content: text });
    } catch (error) {
        console.error('Gemini content generation error:', error);
        res.status(500);
        throw new Error('Failed to generate AI content');
    }
});

const chatWithAI = asyncHandler(async (req, res) => {
    const { history, newMessage } = req.body;

    if (!newMessage) {
        res.status(400);
        throw new Error('New message is required');
    }

    const systemInstruction =
        'You are SoulBot, a compassionate and supportive AI companion. You listen, understand, and offer gentle, supportive, and concise responses. You are a friend.';

    try {
        const conversationHistory = history || [];
        const fullPrompt = `${systemInstruction}\n\nConversation History:\n${conversationHistory
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join('\n')}\n\nUser: ${newMessage}\n\nAssistant:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: fullPrompt,
        });

        const text = response.text;

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini chat error:', error);
        res.status(500);
        throw new Error('Failed to get AI chat response');
    }
});

const generateQuote = asyncHandler(async (req, res) => {
    const { mood, category } = req.body;
    const prompt = `Generate a single lined unique, short, and creative ${category} quote for someone feeling ${mood}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
    });

    const text = response.text;

    res.json({ quote: text });
});

export { chatWithAI, generateInspirationalContent, generateQuote };
