import { NextFunction } from "express";
import { Document } from "mongoose";
import { mainError } from "../error/mainError";
import { Request, Response } from "express";
import errorBuilder from "../error/handleError";

export const errorHandler = (
  err: mainError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorBuilder(err, res);
};
export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

export enum HTTP {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 404,
  NOT_FOUND,
  CONFILT = 409,
}
export interface iUser {
  email: string;
  password: string;
  verified: boolean;
  token: string;
  profile: Array<string>;
  history: Array<string>;
  beg: {}[];
}

export interface iProfile {
  name: string;
  phoneNumber: string;
  address: string;
  userID: string;
  aboutUs: string;
  user: {};
}

export interface iFund {
  title: string;
  description: string;
  amountNeeded: number;
  amountRaised: number;
  category: string;
  userID: string;
  image: string;
  imageID: string;
  like: [""];
  checkOut: Array<string>;
  user: {};
}

export interface iUserData extends iUser, Document {}
export interface iProfileData extends iProfile, Document {}
export interface iFundData extends iFund, Document {}
