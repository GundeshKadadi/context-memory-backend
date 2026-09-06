import {
  Request,
  Response,
} from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";


function createToken(
  userId: string
) {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is missing"
    );
  }

  return jwt.sign(
    {},
    secret,
    {
      subject: userId,
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
}


// REGISTER

export async function register(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters",
      });
    }

    if (
      bcrypt.truncates(
        password
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password is too long",
      });
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        passwordHash,
      });

    const token =
      createToken(
        user._id.toString()
      );

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      token,

      user: {
        id:
          user._id.toString(),

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error: any) {
    console.error(
      "Register error:",
      error
    );

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account",
    });
  }
}


// LOGIN

export async function login(
  req: Request,
  res: Response
) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email:
          normalizedEmail,

        isActive: true,
      }).select(
        "+passwordHash"
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token =
      createToken(
        user._id.toString()
      );

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id:
          user._id.toString(),

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login",
    });
  }
}


// CURRENT USER

export async function getMe(
  req: Request,
  res: Response
) {
  try {
    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch user",
    });
  }
}