import app from "./app.js";
import { connectDB } from "./configs/database.js";
import { config } from "./configs/config.js";
import { processPendingReplicationJobs } from "./modules/replication/replication.service.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port, async () => {
    console.log(`http://localhost:${config.server.port}`);
    await processPendingReplicationJobs();
  });
};

startServer();
