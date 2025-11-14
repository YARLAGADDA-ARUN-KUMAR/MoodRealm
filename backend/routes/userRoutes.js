import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { getUserProfile, loginUser, registerUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import { loginUserRules, registerUserRules, validate } from '../middleware/validationMiddleware.js';

const userRoutes = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

userRoutes.post('/signup', authLimiter, registerUserRules(), validate, registerUser);
userRoutes.post('/login', authLimiter, loginUserRules(), validate, loginUser);

userRoutes.get('/profile', protect, getUserProfile);

export default userRoutes;
