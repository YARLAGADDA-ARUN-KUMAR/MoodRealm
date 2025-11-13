import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Mood Realm API is running!" });
});

app.listen(PORT, () => {
    console.log(`Mood Realm server running on port: ${PORT}`);
});
