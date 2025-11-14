import { GoogleGenAI } from '@google/genai';
import asyncHandler from 'express-async-handler';
import Conversation from '../models/conversationModel.js';

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const buildTextContent = (text, role = 'user') => ({
    role,
    parts: [{ text }],
});

const getTextFromResponse = (response) => {
    try {
        return response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } catch (e) {
        console.error('Error extracting text from response:', e);
        return null;
    }
};

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
        if (!text) throw new Error('Gemini response did not include text');

        res.json({ content: text });
    } catch (error) {
        console.error('Gemini content generation error:', error);
        res.status(500).json({ message: 'Failed to generate AI content' });
    }
});

const chatWithAI = asyncHandler(async (req, res) => {
    const { history = [], newMessage } = req.body;
    const userId = req.user._id;

    if (!newMessage) {
        return res.status(400).json({ message: 'New message is required' });
    }

    const systemInstruction =
        'You are SoulBot, a compassionate and supportive AI companion. Respond with empathy, encouragement, and concise guidance.';

    let conversation = await Conversation.findOne({ user: userId });
    if (!conversation) {
        conversation = await Conversation.create({
            user: userId,
            messages: [
                { role: 'user', content: systemInstruction },
                { role: 'model', content: 'Ok, I will be SoulBot.' },
            ],
        });
    }

    conversation.messages.push({ role: 'user', content: newMessage });

    const geminiHistory = conversation.messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
    }));

    try {
        const chat = await ai.models.startChat({
            model: DEFAULT_GEMINI_MODEL,
            history: geminiHistory.slice(0, -1),
        });

        const response = await chat.sendMessage(newMessage);
        const text = getTextFromResponse(response);

        if (!text) throw new Error('Gemini response did not include text');

        conversation.messages.push({ role: 'model', content: text });
        await conversation.save();

        res.json({ reply: text });
    } catch (error) {
        console.error('Gemini chat error:', error);
        res.status(500).json({ message: 'Failed to get AI chat response' });
    }
});

const getChatHistory = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({ user: req.user._id });

    if (conversation) {
        return res.json(conversation.messages.slice(2));
    }

    res.json([
        {
            role: 'model',
            content: "Hello! I'm your AI companion. How can I support you today?",
            timestamp: new Date().toISOString(),
        },
    ]);
});

const clearChatHistory = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({ user: req.user._id });

    if (conversation) {
        conversation.messages = [
            {
                role: 'user',
                content:
                    'You are SoulBot, a compassionate and supportive AI companion. Respond with empathy, encouragement, and concise guidance.',
            },
            { role: 'model', content: 'Ok, I will be SoulBot.' },
        ];
        await conversation.save();
    }

    res.json({ message: 'Conversation cleared' });
});

export { chatWithAI, clearChatHistory, generateInspirationalContent, getChatHistory };
