import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ZodType,
} from "zod";

export function validateBody(
  schema: ZodType
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result =
      schema.safeParse(
        req.body
      );

    if (!result.success) {
      const errors =
        result.error.issues.map(
          (issue) => ({
            field:
              issue.path.join("."),
            message:
              issue.message,
          })
        );

      return res
        .status(400)
        .json({
          success: false,

          message:
            "Validation failed",

          errors,
        });
    }

    // Use sanitized/validated data
    req.body =
      result.data;

    next();
  };
}