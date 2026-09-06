import {
  Router,
} from "express";

import {
  createMemory,
  deleteMemory,
  getMemories,
  getMemoryById,
  updateMemory,
} from "../controllers/memoryController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  validateBody,
} from "../middleware/validateMiddleware";

import {
  createMemorySchema,
  updateMemorySchema,
} from "../validators/memoryValidator";


const router =
  Router();


router.use(
  requireAuth
);


// CREATE

router.post(
  "/",

  validateBody(
    createMemorySchema
  ),

  createMemory
);


// GET ALL

router.get(
  "/",
  getMemories
);


// GET ONE

router.get(
  "/:id",
  getMemoryById
);


// UPDATE

router.patch(
  "/:id",

  validateBody(
    updateMemorySchema
  ),

  updateMemory
);


// DELETE

router.delete(
  "/:id",
  deleteMemory
);


export default router;