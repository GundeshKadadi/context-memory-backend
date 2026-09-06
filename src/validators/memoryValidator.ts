import {
  z,
} from "zod";


const memoryType =
  z.enum([
    "PERSON",
    "LOCATION",
    "PROJECT",
    "TIME",
    "CUSTOM",
  ]);


const memoryPriority =
  z.enum([
    "LOW",
    "NORMAL",
    "HIGH",
  ]);


const memoryStatus =
  z.enum([
    "ACTIVE",
    "COMPLETED",
    "SNOOZED",
    "ARCHIVED",
  ]);


const locationSchema =
  z
    .object({
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional(),

      longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional(),

      radius: z
        .number()
        .positive()
        .max(50000)
        .optional(),

      placeName: z
        .string()
        .trim()
        .max(300)
        .optional(),

      address: z
        .string()
        .trim()
        .max(1000)
        .optional(),
    })
    .strict();


const aiSchema =
  z
    .object({
      generated:
        z.boolean().optional(),

      confidence: z
        .number()
        .min(0)
        .max(1)
        .optional(),

      detectedContext: z
        .string()
        .max(500)
        .optional(),

      detectedTrigger: z
        .string()
        .max(500)
        .optional(),
    })
    .strict();


export const createMemorySchema =
  z
    .object({
      originalText: z
        .string()
        .trim()
        .max(5000)
        .optional(),

      title: z
        .string()
        .trim()
        .min(
          1,
          "Title is required"
        )
        .max(500),

      context: z
        .string()
        .trim()
        .min(
          1,
          "Context is required"
        )
        .max(200),

      type:
        memoryType,

      trigger: z
        .string()
        .trim()
        .min(
          1,
          "Trigger is required"
        )
        .max(500),

      icon: z
        .string()
        .max(20)
        .optional(),

      priority:
        memoryPriority.optional(),

      location:
        locationSchema.optional(),

      ai:
        aiSchema.optional(),
    })
    .strict();


export const updateMemorySchema =
  z
    .object({
      originalText: z
        .string()
        .trim()
        .max(5000)
        .optional(),

      title: z
        .string()
        .trim()
        .min(1)
        .max(500)
        .optional(),

      context: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .optional(),

      type:
        memoryType.optional(),

      trigger: z
        .string()
        .trim()
        .min(1)
        .max(500)
        .optional(),

      icon: z
        .string()
        .max(20)
        .optional(),

      priority:
        memoryPriority.optional(),

      status:
        memoryStatus.optional(),

      location:
        locationSchema.optional(),

      ai:
        aiSchema.optional(),
    })
    .strict()
    .refine(
      (data) =>
        Object.keys(data)
          .length > 0,
      {
        message:
          "At least one field is required",
      }
    );