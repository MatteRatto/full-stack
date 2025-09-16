const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const postsRoutes = require("./src/routes/postsRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "https://full-stack-mr.netlify.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
      ];

      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`❌ CORS blocked for origin: ${origin}`);
        }
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Troppe richieste da questo IP, riprova più tardi.",
});
app.use("/api/", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use(errorHandler);

module.exports = app;
