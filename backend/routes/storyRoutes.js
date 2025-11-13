import express from "express";
import {
    createStory,
    getPublicStories,
    getMyStories,
    getStoryById,
    deleteStory,
    toggleStoryLike,
    toggleStoryReport,
    addComment,
} from "../controllers/storyController.js";
import protect from "../middleware/authMiddleware.js";

const storyRoutes = express.Router();

storyRoutes.post("/", protect, createStory);
storyRoutes.get("/", getPublicStories);
storyRoutes.get("/my", protect, getMyStories);

storyRoutes
    .route("/:id")
    .get(protect, getStoryById)
    .delete(protect, deleteStory);

storyRoutes.post("/:id/like", protect, toggleStoryLike);
storyRoutes.post("/:id/report", protect, toggleStoryReport);
storyRoutes.post("/:id/comment", protect, addComment);

export default storyRoutes;
