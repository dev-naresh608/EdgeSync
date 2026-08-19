import { config } from "../configs/config.js";

const trustedServers = {
  india: process.env.INDIA_SERVER_SECRET,
  singapore: process.env.SINGAPORE_SERVER_SECRET,
  germany: process.env.GERMANY_SERVER_SECRET,
};

export const authenticateInternalServer = (req, res, next) => {
  try {
    const sourceNode = req.headers["x-node-id"];
    const serverSecret = req.headers["x-server-secret"];

    if (!sourceNode || !serverSecret) {
      return res.status(401).json({
        success: false,
        message: "Internal server credentials are required",
      });
    }

    const expectedSecret = trustedServers[sourceNode];

    if (!expectedSecret) {
      return res.status(403).json({
        success: false,
        message: "Unknown source node",
      });
    }

    if (serverSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: "Invalid server credentials",
      });
    }

    if (sourceNode === config.node.id) {
      return res.status(403).json({
        success: false,
        message: "Node cannot authenticate itself",
      });
    }

    req.sourceNode = sourceNode;

    next();
  } catch (error) {
    next(error);
  }
};