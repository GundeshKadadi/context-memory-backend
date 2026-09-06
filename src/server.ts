import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import {
  connectDatabase,
} from "./config/database";

import {
  corsOptions,
} from "./config/cors";

import authRoutes from "./routes/authRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import aiRoutes from "./routes/aiRoutes";

import {
  apiLimiter,
} from "./middleware/rateLimitMiddleware";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorMiddleware";



const app =
  express();


const PORT =
  Number(
    process.env.PORT
  ) || 5000;


// ------------------------------------
// Security
// ------------------------------------

app.disable(
  "x-powered-by"
);

app.use(
  helmet()
);


// ------------------------------------
// CORS
// ------------------------------------

app.use(
  cors(corsOptions)
);


// ------------------------------------
// Request parsing
// ------------------------------------

app.use(
  express.json({
    limit: "1mb",
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);


// ------------------------------------
// General API rate limit
// ------------------------------------

app.use(
  "/api",
  apiLimiter
);


// ------------------------------------
// Health
// ------------------------------------

app.get(
  "/api/health",
  (_req, res) => {
    return res
      .status(200)
      .json({
        success: true,

        message:
          "Context Memory API is running",

        environment:
          process.env.NODE_ENV ||
          "development",
      });
  }
);


// ------------------------------------
// Routes
// ------------------------------------

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/memories",
  memoryRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);

// ------------------------------------
// 404
// ------------------------------------

app.use(
  notFoundHandler
);


// ------------------------------------
// Global error handler
// IMPORTANT: Keep last
// ------------------------------------

app.use(
  errorHandler
);


// ------------------------------------
// Server
// ------------------------------------

async function startServer() {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Context Memory API running on port ${PORT}`
        );

        console.log(
          `🌍 Environment: ${
            process.env.NODE_ENV ||
            "development"
          }`
        );
      }
    );
  } catch (error) {
    console.error(
      "Unable to start server:",
      error
    );

    process.exit(1);
  }
}


startServer();