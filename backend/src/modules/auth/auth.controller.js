import { config } from "../../configs/config.js";

import {
  registerSvc,
  loginSvc,
  getMeSvc,
  rotateTokenSvc,
} from "./auth.services.js";

import {
  serverError,
  badRequest,
} from "../../utils/response.js";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const register = async (req, res) => {
  try {
    const response = await registerSvc(req.body);

    if (!response?.success) {
      return badRequest(res, response?.message || "Register failed");
    }

    const { accessToken, refreshToken, user } = response;

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: response.message,
      accessToken,
      user,
    });
  } catch (error) {
    return serverError(res, error, "register failed");
  }
};

export const login = async (req, res) => {
  try {
    const response = await loginSvc(req.body);

    if (!response?.success) {
      return badRequest(res, response?.message || "Login failed");
    }

    const { accessToken, refreshToken, user } = response;

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: response.message,
      accessToken,
      user,
    });
  } catch (error) {
    return serverError(res, error, "Login Failed");
  }
};

export const getMe = async (req, res) => {
  const response = await getMeSvc(req.user.sub);

  if (!response?.success) {
    return badRequest(res, response?.message || "User not found");
  }

  return res.status(200).json(response);
};

export const rotateToken = async (req, res) => {
  const response = await rotateTokenSvc(req.user.sub);

  if (!response?.success) {
    return badRequest(res, response?.message || "Failed to rotate token");
  }

  const { accessToken, refreshToken, user, message } = response;

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  return res.status(200).json({
    success: true,
    message: message || "Token refreshed successfully",
    accessToken,
    user,
  });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
