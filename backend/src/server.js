import app from "./app.js";
import { connectDB } from "./configs/database.js";
import { config } from "./configs/config.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port, () => {
    console.log(`http://localhost:${config.server.port}`);
  });
};

startServer();
