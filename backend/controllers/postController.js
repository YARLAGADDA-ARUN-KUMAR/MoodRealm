import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';

const REPORT_THRESHOLD = 15;

const SORT_PIPELINES = {
    latest: { createdAt: -1 },
    likes: { likesCount: -1, createdAt: -1 },
    comments: { commentsCount: -1, createdAt: -1 },
};

const populateOptions = [
    { path: 'user', select: 'name email' },
    { path: 'comments.user', select: 'name' },
];

const getAllPosts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const mood = req.query.mood;
    const contentType = req.query.contentType;
    const sort = req.query.sort || 'latest';

    const filter = {};
    if (mood && mood !== 'all') {
        filter.mood = mood;
    }
    if (contentType) {
        filter.contentType = contentType;
    }

    const matchStage = Object.keys(filter).length ? [{ $match: filter }] : [];
    const addFieldsStage = [
        {
            $addFields: {
                likesCount: { $size: '$likes' },
                commentsCount: { $size: '$comments' },
            },
        },
    ];

    if (sort === 'random') {
        const pipeline = [
            ...matchStage,
            { $sample: { size: limit } },
            ...addFieldsStage,
        ];
        const randomPosts = await Post.aggregate(pipeline);
        await Post.populate(randomPosts, populateOptions);
        return res.json(randomPosts);
    }

    const sortStage = [
        { $sort: SORT_PIPELINES[sort] || SORT_PIPELINES.latest },
    ];
    const paginationStages = [
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];

    const pipeline = [
        ...matchStage,
        ...addFieldsStage,
        ...sortStage,
        ...paginationStages,
    ];

    const posts = await Post.aggregate(pipeline);
    await Post.populate(posts, populateOptions);

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

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((likeId) => likeId.toString() === userId);

    if (alreadyLiked) {
        post.likes.pull(req.user._id);
    } else {
        post.likes.addToSet(req.user._id);
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
    await post.populate({ path: 'comments.user', select: 'name' });

    res.status(201).json(post.comments);
});

const togglereport = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const alreadyReported = post.reports.some((reportId) => reportId.toString() === userId);

    if (alreadyReported) {
        post.reports.pull(req.user._id);
    } else {
        post.reports.addToSet(req.user._id);
    }

    await post.save();

    if (post.reports.length >= REPORT_THRESHOLD) {
        await post.deleteOne();
        return res.json({ message: 'Post deleted due to reports' });
    }

    res.json({ reports: post.reports.length });
});

export { addComment, createPost, deletePost, getAllPosts, getUserPosts, toggleLike, togglereport };
