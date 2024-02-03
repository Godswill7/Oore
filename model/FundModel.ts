import { Schema, Types, model } from "mongoose";
import { iFundData } from "../utils/interface";

const FundModel = new Schema<iFundData>(
  {
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    userID: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    imageID: {
      type: String,
    },
    amountNeeded: {
      type: Number,
    },
    amountRaised: {
      type: Number,
    },
    checkOut: [
      {
        type: Types.ObjectId,
        ref: "checkouts",
      },
    ],
    like:[ {
      type: String,
    }],
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default model<iFundData>("begs", FundModel);