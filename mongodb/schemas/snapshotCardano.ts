import mongoose, { Document, Schema } from "mongoose";

export interface CardanoSnapshotDoc extends Document {
  batchId: mongoose.Types.ObjectId;
  poolId: string;
  epoch: number;
  delegatorAddress: string;
  partnerData: string;
}

const CardanoSnapshotSchema: Schema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Types.ObjectId, required: true },
    poolId: { type: String, required: true },
    epoch: { type: Number, required: true },
    delegatorAddress: { type: String, required: true },
    partnerData: { type: String, required: true },
  },
  { timestamps: true }
);

export const CardanoSnapshot = mongoose.model<CardanoSnapshotDoc>(
  "CardanoSnapshot",
  CardanoSnapshotSchema
);
