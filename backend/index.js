import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import aiRoutes from './routes/aiRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Mood Realm API is running!' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Mood Realm server running on port: ${PORT}`);
    }
});
