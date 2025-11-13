import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getAllPosts,
    getUserPosts,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    togglereport,
} from "../controllers/postController.js";

const postRoutes = express.Router();

postRoutes.route("/").get(getAllPosts).post(protect, createPost);

postRoutes.get("/user/:id", getUserPosts);

postRoutes.route("/:id").delete(protect, deletePost);

postRoutes.post("/:id/like", protect, toggleLike);
postRoutes.post("/:id/report", protect, togglereport);
postRoutes.post("/:id/comment", protect, addComment);

export default postRoutes;
