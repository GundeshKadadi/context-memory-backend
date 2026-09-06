import {
  Router,
} from "express";

import {
  parseMemory,
} from "../controllers/aiController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  validateBody,
} from "../middleware/validateMiddleware";

import {
  parseMemorySchema,
} from "../validators/aiValidator";

const router =
  Router();

router.use(
  requireAuth
);

router.post(
  "/parse-memory",

  validateBody(
    parseMemorySchema
  ),

  parseMemory
);

export default router;