import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.passwordHash;
      },
    },
  }
);

const User = model(
  "User",
  userSchema
);

export default User;