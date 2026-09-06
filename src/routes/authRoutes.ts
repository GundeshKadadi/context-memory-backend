import {
  Router,
} from "express";

import {
  getMe,
  login,
  register,
} from "../controllers/authController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  authLimiter,
} from "../middleware/rateLimitMiddleware";

import {
  validateBody,
} from "../middleware/validateMiddleware";

import {
  loginSchema,
  registerSchema,
} from "../validators/authValidator";


const router =
  Router();


router.post(
  "/register",

  authLimiter,

  validateBody(
    registerSchema
  ),

  register
);


router.post(
  "/login",

  authLimiter,

  validateBody(
    loginSchema
  ),

  login
);


router.get(
  "/me",

  requireAuth,

  getMe
);


export default router;