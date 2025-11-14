import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['user', 'model'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false },
);

const conversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        messages: [messageSchema],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Conversation', conversationSchema);
