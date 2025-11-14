import express from 'express';
import {
    addComment,
    createPost,
    deletePost,
    getAllPosts,
    getUserPosts,
    toggleLike,
    togglereport,
} from '../controllers/postController.js';
import protect from '../middleware/authMiddleware.js';
import { addCommentRules, createPostRules, validate } from '../middleware/validationMiddleware.js';

const postRoutes = express.Router();

postRoutes.route('/').get(getAllPosts).post(protect, createPostRules(), validate, createPost);

postRoutes.get('/user/:id', getUserPosts);

postRoutes.route('/:id').delete(protect, deletePost);

postRoutes.post('/:id/like', protect, toggleLike);
postRoutes.post('/:id/report', protect, togglereport);
postRoutes.post('/:id/comment', protect, addCommentRules(), validate, addComment);

export default postRoutes;
