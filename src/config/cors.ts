import { CorsOptions } from "cors";

const allowedOrigins =
  process.env.WEB_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

console.log(
  "🌐 Allowed CORS origins:",
  allowedOrigins
);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    console.log(
      "🌐 Incoming Origin:",
      origin
    );

    // Android / iOS native / Postman
    // usually do not send Origin
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
      return;
    }

    console.warn(
      `❌ CORS blocked: ${origin}`
    );

    callback(
      new Error(
        `Origin ${origin} is not allowed by CORS`
      )
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: false,

  optionsSuccessStatus: 204,
};