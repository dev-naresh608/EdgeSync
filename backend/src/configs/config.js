import "dotenv/config";

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is undefined in environment variables`);
  }

  return value;
};

export const config = {
  env: process.env.NODE_ENV || "development",

  database: {
    uri: requiredEnv("DATABASE_URI"),
  },

  server: {
    port: Number(process.env.PORT) || 5000,
  },

  auth: {
    accessTokenSecret: requiredEnv("JWT_ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: requiredEnv("JWT_REFRESH_TOKEN_SECRET"),
    accessTokenExpiresIn: requiredEnv("JWT_ACCESS_TOKEN_EXPIRE"),
    refreshTokenExpiresIn: requiredEnv("JWT_REFRESH_TOKEN_EXPIRE"),
  },
};
