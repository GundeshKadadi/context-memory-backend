import {
  Schema,
  model,
} from "mongoose";

const memorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalText: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    context: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    type: {
      type: String,

      enum: [
        "PERSON",
        "LOCATION",
        "PROJECT",
        "TIME",
        "CUSTOM",
      ],

      required: true,
    },

    trigger: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "🧠",
    },

    priority: {
      type: String,

      enum: [
        "LOW",
        "NORMAL",
        "HIGH",
      ],

      default: "NORMAL",
    },

    status: {
      type: String,

      enum: [
        "ACTIVE",
        "COMPLETED",
        "SNOOZED",
        "ARCHIVED",
      ],

      default: "ACTIVE",
    },

    location: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      radius: {
        type: Number,
        default: 200,
        min: 1,
      },

      placeName: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        trim: true,
      },
    },

    ai: {
      generated: {
        type: Boolean,
        default: false,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },

      detectedContext: {
        type: String,
      },

      detectedTrigger: {
        type: String,
      },
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id =
          ret._id.toString();

        delete ret._id;
      },
    },
  }
);


// Fast queries per user

memorySchema.index({
  user: 1,
  createdAt: -1,
});

memorySchema.index({
  user: 1,
  status: 1,
});

memorySchema.index({
  user: 1,
  type: 1,
});

const Memory = model(
  "Memory",
  memorySchema
);

export default Memory;