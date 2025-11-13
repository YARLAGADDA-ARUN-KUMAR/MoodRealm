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
    { timestamps: true }
);

const storySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String },
        content: {
            type: String,
            required: true,
        },
        coverImage: {
            url: { type: String },
            public_id: { type: String },
        },
        privacy: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [commentSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Story", storySchema);
