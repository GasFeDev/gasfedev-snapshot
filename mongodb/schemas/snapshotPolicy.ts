import mongoose, { Document, Schema } from "mongoose";

export interface CardanoPolicyDoc extends Document {
  id: mongoose.Types.ObjectId;
  name: string;
  value: string;
  minQuantity: string;
}

const CardanoPolicySchema: Schema = new mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
    minQuantity: { type: String, required: true },
  },
  { timestamps: true }
);

export const CardanoPartnerPolicy = mongoose.model<CardanoPolicyDoc>(
  "CardanoPolicy",
  CardanoPolicySchema
);
