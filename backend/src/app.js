import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import {
  authRouter,
  resourceRouter,
  replicationRouter,
} from "./routes.js";

const app = express();

// Middle Wares
app.use(cors());
app.use(cookieParser());
app.use(
  express.json({
    limit: "100mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  }),
);

app.use(morgan("dev"));

// ROUTES:
app.get("/api/test", (req, res) => {
  res.send("api running");
});

// OTHER ROUTES
app.use("/api/auth", authRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/replication", replicationRouter);

export default app;