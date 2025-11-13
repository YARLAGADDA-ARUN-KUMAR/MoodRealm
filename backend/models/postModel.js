import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        mood: {
            type: String,
            enum: [
                "Inspired",
                "Joyful",
                "Grateful",
                "Romantic",
                "Heartbroken",
                "Lonely",
                "Creative",
                "Motivated",
                "Anxious",
                "Funny",
                "Neutral",
            ],
            default: "Neutral",
            required: true,
        },
        contentType: {
            type: String,
            enum: [
                "Quote",
                "Life Lesson",
                "Story",
                "Flirty Line",
                "Poem",
                "Thought",
            ],
            default: "Thought",
            required: true,
        },
        backgroundImage: {
            type: String,
            default: null,
        },
        backgroundStyle: {
            type: String,
            default: null,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [commentSchema],
        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", postSchema);
