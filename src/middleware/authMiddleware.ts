import {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";


export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const token =
      authorization.substring(7);

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET is missing"
      );
    }

    const decoded =
      jwt.verify(
        token,
        secret,
        {
          algorithms: ["HS256"],
        }
      );

    if (
      typeof decoded !==
        "object" ||
      typeof decoded.sub !==
        "string"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });
    }

    req.userId =
      decoded.sub;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
}