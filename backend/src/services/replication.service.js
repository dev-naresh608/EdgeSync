import axios from "axios";
import { config } from "../configs/config.js";

export const replicateResource = async (resource) => {
  const currentNode = config.node.id;

  for (const [nodeId, nodeUrl] of Object.entries(config.nodes)) {
    if (nodeId === currentNode) continue;

    console.log(`Replicating resource to ${nodeId}`);

    await axios.post(
      `${nodeUrl}/api/resources/internal/replicate`,
      resource,
      {
        headers: {
          "x-node-id": currentNode,
          "x-server-secret": config.server.secret,
        },
      },
    );
  }
};