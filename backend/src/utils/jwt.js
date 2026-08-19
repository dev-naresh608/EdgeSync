import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";

export const generateAccessToken = (userId,region) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      type: "access",
      region: region,
    },
    config.auth.accessTokenSecret,
    {
      expiresIn: config.auth.accessTokenExpiresIn,
    },
  );
};

export const generateRefreshToken = (userId,region) => {
  return jwt.sign(
    {
      sub: userId.toString(),
      region,
      type: "refresh",
    },
    config.auth.refreshTokenSecret,
    {
      expiresIn: config.auth.refreshTokenExpiresIn,
    },
  );
};
