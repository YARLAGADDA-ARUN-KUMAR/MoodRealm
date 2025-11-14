import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';

const getAllPosts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const mood = req.query.mood;
    const contentType = req.query.contentType;

    let filter = {};
    if (mood && mood !== 'all') {
        filter.mood = mood;
    }

    if (contentType) {
        filter.contentType = contentType;
    }

    const posts = await Post.find(filter)
        .populate('user', 'name email')
        .populate('comments.user', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json(posts);
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const page = Number(req.query.page) || 1;
    const limit = 10;

    const posts = await Post.find({ user: id })
        .populate('user', 'name email')
        .populate('comments.user', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
    const { content, mood, contentType, backgroundImage, backgroundStyle } = req.body;

    if (!content || !mood || !contentType) {
        return res.status(400).json({ message: 'Content, mood, and contentType are required' });
    }

    const post = await Post.create({
        user: req.user._id,
        content,
        mood,
        contentType,
        backgroundImage: backgroundImage || null,
        backgroundStyle: backgroundStyle || null,
    });

    res.status(201).json(post);
});

const deletePost = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Not allowed' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
});

const toggleLike = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
        post.likes.pull(req.user._id);
    } else {
        post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length });
});

const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    res.json(post.comments);
});

const togglereport = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyReported = post.reports.includes(req.user._id);

    if (alreadyReported) {
        post.reports.pull(req.user._id);
    } else {
        post.reports.push(req.user._id);
    }

    await post.save();

    if (post.reports.length === 15) {
        await post.deleteOne();
        return res.json({ message: 'Post deleted due to reports' });
    }

    res.json({ reports: post.reports.length });
});

export { addComment, createPost, deletePost, getAllPosts, getUserPosts, toggleLike, togglereport };
