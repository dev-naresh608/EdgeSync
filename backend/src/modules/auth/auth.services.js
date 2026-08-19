import bcrypt from "bcrypt";

import User from "../user/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  region: user.region,
});

export const registerSvc = async (payload) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  try {
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      region: payload.region,
    });

    const accessToken = generateAccessToken(user._id,user.region);
    const refreshToken = generateRefreshToken(user._id,user.region);

    return {
      success: true,
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
      message: "Account created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Signup failed",
    };
  }
};

export const loginSvc = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return { success: false, message: "Invalid email or password" };
  }

  const accessToken = generateAccessToken(user._id,user.region);
  const refreshToken = generateRefreshToken(user._id,user.region);

  return {
    success: true,
    user: sanitizeUser(user),
    message: "User logged in successfully",
    accessToken,
    refreshToken,
  };
};

export const getMeSvc = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    message: "User retrieved successfully",
    user: sanitizeUser(user),
  };
};

export const rotateTokenSvc = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const accessToken = generateAccessToken(user._id,user.region);
  const refreshToken = generateRefreshToken(user._id,user.region);

  return {
    success: true,
    user: sanitizeUser(user),
    message: "Token rotated successfully",
    accessToken,
    refreshToken,
  };
};
