import dotenv from "dotenv";

const nodeId = process.env.NODE_ID;

if (!nodeId) {
  throw new Error("NODE_ID is required");
}

const nodeEnvFile = `.env.${nodeId}`;

dotenv.config({ path: ".env" });
dotenv.config({
  path: nodeEnvFile,
  override: true,
});

const requiredEnv = [
  "DATABASE_URI",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRE",
  "JWT_REFRESH_TOKEN_EXPIRE",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NODE_ID",
  "PORT",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables:\n- ${missingEnv.join("\n- ")}`,
  );
}

export const config = {
  env: process.env.NODE_ENV || "development",

  node: {
    id: process.env.NODE_ID,
  },

  server: {
    port: Number(process.env.PORT),
    secret: process.env.SERVER_SECRET,
  },

  database: {
    uri: process.env.DATABASE_URI,
  },

  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  nodes: {
    india: process.env.INDIA_SERVER_URL,
    singapore: process.env.SINGAPORE_SERVER_URL,
    germany: process.env.GERMANY_SERVER_URL,
  },
};
