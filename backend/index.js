import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

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

app.use("/", (req, res) => {
  res.json({ message: "Mood Realm API is running!" });
});

app.listen(PORT, () => {
  console.log(`Mood Realm server running on port: ${PORT}`);
});
