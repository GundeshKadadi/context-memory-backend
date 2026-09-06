import {
  NextFunction,
  Request,
  Response,
} from "express";


export function notFoundHandler(
  req: Request,
  res: Response
) {
  return res.status(404).json({
    success: false,

    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
}


export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(
    "Unhandled API error:",
    error
  );

  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return res.status(500).json({
    success: false,

    message:
      "Internal server error",

    ...(!isProduction && {
      error:
        error.message,
    }),
  });
}