import {
  CorsOptions,
} from "cors";

const configuredOrigins =
  process.env.WEB_ORIGINS
    ?.split(",")
    .map((origin) =>
      origin.trim()
    )
    .filter(Boolean) ?? [];

const developmentOrigins = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:19006",
  "http://127.0.0.1:19006",
];

const allowedOrigins =
  process.env.NODE_ENV ===
  "production"
    ? configuredOrigins
    : [
        ...new Set([
          ...configuredOrigins,
          ...developmentOrigins,
        ]),
      ];

export const corsOptions:
  CorsOptions = {
  origin(origin, callback) {
    // Android/iOS/Postman may not send an Origin header
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      callback(null, true);
      return;
    }

    console.warn(
      `Blocked CORS origin: ${origin}`
    );

    callback(
      new Error(
        "Origin not allowed by CORS"
      )
    );
  },

  methods: [
    "GET",
    "POST",
    "PATCH",
    "PUT",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};