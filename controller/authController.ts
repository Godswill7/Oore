import authModel from "../model/authModel";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { resetMail, sendMail } from "../utils/email";
import { HTTP } from "../utils/interface";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(10).toString("hex");

    const user = await authModel.create({
      email,
      password: hashed,
      token: value,
    });
    const token = jwt.sign({ id: user._id }, "token");

    sendMail(user, token).then(() => {
      console.log("Mail sent...!");
    });

    return res.status(HTTP.CREATED).json({
      message: "Registered user",
      data: user,
      token,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error registering user",
      data: error.message,
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;

    const getUser: any = jwt.verify(
      token,
      "token",
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const verifiedUser = await authModel.findByIdAndUpdate(
      getUser.id,
      {
        token: "",
        verified: true,
      },
      { new: true }
    );

    return res.status(HTTP.CREATED).json({
      message: "user verified",
      data: verifiedUser,
      status: HTTP.CREATED,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error verifying user",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User is not found",
      });
    }

    if (!user.verified && user.token !== "") {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "user has not been verified",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign({ id: user?._id, email: user?.email }, "token");

    return res.status(HTTP.CREATED).json({
      message: `Welcome Back ${user.email}`,
      data: token,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error signing in user",
      data: error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const user = await authModel.findById(userID);

    if (!user) {
      return res.status(HTTP.CREATED).json({
        message: "User does not exist",
        status: HTTP.CREATED,
      });
    }

    await authModel.findByIdAndDelete(userID);

    return res.status(HTTP.CREATED).json({
      message: "Deleted",
      status: HTTP.CREATED,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error deleting user",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const viewAllUser = async (req: Request, res: Response) => {
  try {
    const user = await authModel.find();

    return res.status(HTTP.OK).json({
      message: "viewing all user",
      data: user,
      status: HTTP.OK,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error viewing all users",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const viewOneUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await authModel.findById(userID);

    if (!user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User does not exist",
        status: HTTP.BAD_REQUEST,
      });
    }

    return res.status(HTTP.OK).json({
      message: "viewing one user",
      data: user,
      status: HTTP.OK,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error viewing one user",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const resetUserPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const user: any = await authModel.findOne({ email });

    if (!user.verified && user.token !== "") {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Unable to reset password, Pls verify your Account!!!",
      });
    }

    const token = jwt.sign({ id: user._id }, "token");
    const reset = await authModel.findByIdAndUpdate(
      user._id,
      {
        token,
      },
      { new: true }
    );

    resetMail(user, token).then(() => {
      console.log("Reset Mail sent...!");
    });

    return res.status(HTTP.OK).json({
      message: "Access granted to change password",
      data: reset,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error reseting password",
      data: error.message,
    });
  }
};

export const changeUserPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const getUserID: any = jwt.verify(
      token,
      "token",
      (err: any, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      }
    );

    const user: any = await authModel.findById(getUserID.id);

    if (!user.verified && user.token !== "") {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "you can't change this password",
      });
    }

    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salted);

    const variable = await authModel.findByIdAndUpdate(
      user._id,
      {
        password: hashed,
        token: "",
      },
      { new: true }
    );

    return res.status(HTTP.CREATED).json({
      message: "success in changing password",
      data: variable,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error changing User Password",
      data: error.message,
    });
  }
};
