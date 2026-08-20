import mongoose from "mongoose";

const replicationSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    sourceNode: {
      type: String,
      enum: ["india", "singapore", "germany"],
      required: true,
    },

    targetNode: {
      type: String,
      enum: ["india", "singapore", "germany"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Replication = mongoose.model("Replication", replicationSchema);

export default Replication;
