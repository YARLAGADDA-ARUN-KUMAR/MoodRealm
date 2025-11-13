import Story from "../models/storyModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const createStory = asyncHandler(async (req, res) => {
    const { title, content, privacy } = req.body;

    const story = await Story.create({
        user: req.user._id,
        title,
        content,
        privacy,
    });

    res.status(201).json(story);
});

export const getPublicStories = asyncHandler(async (req, res) => {
    const stories = await Story.find({ privacy: "public" })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.json(stories);
});

export const getMyStories = asyncHandler(async (req, res) => {
    const stories = await Story.find({ user: req.user._id }).sort({
        createdAt: -1,
    });

    res.json(stories);
});

export const getStoryById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!story) return res.status(404).json({ message: "Story not found" });
    if (
        story.privacy === "private" &&
        story.user._id.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({ message: "Not allowed" });
    }

    res.json(story);
});

export const deleteStory = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not allowed" });
    }

    await story.deleteOne();
    res.json({ message: "Story deleted" });
});

export const toggleStoryLike = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked = story.likes.includes(req.user._id);
    if (alreadyLiked) {
        story.likes.pull(req.user._id);
    } else {
        story.likes.push(req.user._id);
    }

    await story.save();
    res.json({ likes: story.likes.length });
});

export const toggleStoryReport = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyReported = story.reports.includes(req.user._id);
    if (alreadyReported) {
        story.reports.pull(req.user._id);
    } else {
        story.reports.push(req.user._id);
    }

    await story.save();
    if (story.reports.length === 15) {
        await story.deleteOne();
        return res.json({ message: "Story deleted due to reports" });
    }
    res.json({ reports: story.reports.length });
});

export const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Comment text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid story ID" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    story.comments.push({ user: req.user._id, text });

    await story.save();
    res.json(story.comments);
});
