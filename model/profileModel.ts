import { model, Schema, Types } from "mongoose";
import { iProfileData } from "../utils/interface";

const profileModel = new Schema<iProfileData>(
  {
    userID: {
      type: String,
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
    aboutUs: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<iProfileData>("profiles", profileModel);