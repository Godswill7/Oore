import { Schema, Types, model } from "mongoose";
import { iUser, iUserData } from "../utils/interface";

const authModel = new Schema<iUserData>(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    profile: [
      {
        type: Types.ObjectId,
        ref: "profiles",
      },
    ],
    beg: [
      {
        type: Types.ObjectId,
        ref: "begs",
      },
    ],
    history: [
      {
        type: Types.ObjectId,
        ref: "histories",
      },
    ],
  },
  { timestamps: true }
);

export default model<iUserData>("users", authModel);
