import {
  Request,
  Response,
} from "express";

import OpenAI from "openai";

import {
  parseMemoryWithAI,
} from "../services/aiService";

export async function parseMemory(
  req: Request,
  res: Response
) {
  try {
    const { text } = req.body;

    const result =
      await parseMemoryWithAI(
        text
      );

    return res.status(200).json({
      success: true,
      memory: result,
    });

  } catch (error: unknown) {

    console.error(
      "========== AI ERROR =========="
    );

    console.error(error);

    if (
      error instanceof
      OpenAI.APIError
    ) {
      console.error(
        "Status:",
        error.status
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Request ID:",
        error.requestID
      );

      return res
        .status(
          error.status || 500
        )
        .json({
          success: false,

          message:
            process.env.NODE_ENV ===
            "development"
              ? error.message
              : "Unable to analyze memory",

          code:
            error.code,
        });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      "Message:",
      message
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          process.env.NODE_ENV ===
          "development"
            ? message
            : "Unable to analyze memory",
      });
  }
}