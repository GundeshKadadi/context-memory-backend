import {
  Request,
  Response,
} from "express";

import {
  isValidObjectId,
} from "mongoose";

import Memory from "../models/Memory";


// CREATE

export async function createMemory(
  req: Request,
  res: Response
) {
  try {
    const {
      originalText,
      title,
      context,
      type,
      trigger,
      icon,
      priority,
      location,
      ai,
    } = req.body;

    if (
      !title?.trim() ||
      !context?.trim() ||
      !type ||
      !trigger?.trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "title, context, type and trigger are required",
      });
    }

    const memory =
      await Memory.create({
        user:
          req.userId,

        originalText,

        title:
          title.trim(),

        context:
          context.trim(),

        type,

        trigger:
          trigger.trim(),

        icon,

        priority,

        status:
          "ACTIVE",

        location,

        ai,
      });

    return res.status(201).json({
      success: true,

      message:
        "Memory created successfully",

      memory,
    });
  } catch (error: any) {
    console.error(
      "Create memory error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to create memory",
    });
  }
}


// GET ALL

export async function getMemories(
  req: Request,
  res: Response
) {
  try {
    const memories =
      await Memory.find({
        user:
          req.userId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count:
        memories.length,
      memories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch memories",
    });
  }
}


// GET ONE

export async function getMemoryById(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid memory id",
      });
    }

    const memory =
      await Memory.findOne({
        _id: id,
        user:
          req.userId,
      });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message:
          "Memory not found",
      });
    }

    return res.status(200).json({
      success: true,
      memory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch memory",
    });
  }
}


// UPDATE

export async function updateMemory(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid memory id",
      });
    }

    const allowedFields = [
      "originalText",
      "title",
      "context",
      "type",
      "trigger",
      "icon",
      "priority",
      "status",
      "location",
      "ai",
    ];

    const updates:
      Record<string, unknown> = {};

    for (
      const field of
      allowedFields
    ) {
      if (
        req.body[field] !==
        undefined
      ) {
        updates[field] =
          req.body[field];
      }
    }

    if (
      updates.status ===
      "COMPLETED"
    ) {
      updates.completedAt =
        new Date();
    }

    if (
      updates.status ===
      "ACTIVE"
    ) {
      updates.completedAt =
        null;
    }

    const memory =
      await Memory.findOneAndUpdate(
        {
          _id: id,
          user:
            req.userId,
        },

        {
          $set: updates,
        },

        {
          returnDocument:
            "after",

          runValidators:
            true,
        }
      );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message:
          "Memory not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Memory updated successfully",

      memory,
    });
  } catch (error: any) {
    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update memory",
    });
  }
}


// DELETE

export async function deleteMemory(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (
      !isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid memory id",
      });
    }

    const memory =
      await Memory.findOneAndDelete({
        _id: id,

        user:
          req.userId,
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message:
          "Memory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Memory deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to delete memory",
    });
  }
}