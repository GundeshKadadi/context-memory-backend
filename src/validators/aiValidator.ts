import { z } from "zod";

export const parseMemorySchema =
  z
    .object({
      text: z
        .string()
        .trim()
        .min(
          3,
          "Memory must contain at least 3 characters"
        )
        .max(
          5000,
          "Memory is too long"
        ),
    })
    .strict();