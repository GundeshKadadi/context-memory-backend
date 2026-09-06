import {
  rateLimit,
} from "express-rate-limit";


// General API protection

export const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      process.env.NODE_ENV ===
      "production"
        ? 300
        : 2000,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });


// Login/Register protection

export const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      process.env.NODE_ENV ===
      "production"
        ? 20
        : 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
    },
  });