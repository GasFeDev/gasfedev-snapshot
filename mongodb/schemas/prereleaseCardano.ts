import mongoose, { Document, Schema } from "mongoose";

export interface CardanoExcludeDoc extends Document {
  epoch: number;
  address: string;
  pool: string;  
}

const CardanoExcludeSchema: Schema = new mongoose.Schema(
  {
    epoch: { type: Number, required: true },
    address: { type: String, required: true },
    pool: { type: String, required: true },    
  },
  { timestamps: true }
);

export const CardanoExclude = mongoose.model<CardanoExcludeDoc>(
  "Prerelease",
  CardanoExcludeSchema
);
