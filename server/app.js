import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
const app = express();

// ==============================
// SECURITY
// ==============================

app.use(helmet());

// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ==============================
// BODY PARSER
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// COOKIE PARSER
// ==============================

app.use(cookieParser());

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JobTrack API is running",
  });
});

export default app;
