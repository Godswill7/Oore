import { Request, Response } from "express";
import { streamUpload } from "../utils/streamUpload";
import authModel from "../model/authModel";
import FundModel from "../model/FundModel";
import { Types } from "mongoose";
import { HTTP } from "../utils/interface";

export const createBeg = async (req: any, res: Response) => {
  try {
    const { userID } = req.params;

    const { title, description, category, amountNeeded } = req.body;

    const { secure_url, public_id }: any = await streamUpload(req);

    const user: any = await authModel.findById(userID);
    if (user) {
      const abeg = await FundModel.create({
        title,
        description,
        category,
        image: secure_url,
        // image: user.email.charAt(0),
        imageID: public_id,
        love: [],
        userID,
        amountNeeded: parseInt(amountNeeded),
        amountRaised: 0,
      });
      // console.log("secure url: ", secure_url);
      // console.log("secure url: ", public_id);

      user?.beg.push(new Types.ObjectId(abeg?._id!));
      user?.save();

      return res.status(HTTP.CREATED).json({
        message: "created beg successfully",
        data: abeg,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "create a profile first",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error creating profile",
      data: error.message,
    });
  }
};

export const viewBeg = async (req: Request, res: Response) => {
  try {
    const abeg = await FundModel.find();

    return res.status(HTTP.OK).json({
      message: "viewing all abeg",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error",
      data: error.message,
    });
  }
};

export const viewOneBegPopulate = async (req: Request, res: Response) => {
  try {
    const { abegID } = req.params;
    const abeg = await authModel.findById(abegID).populate({
      path: "beg",
    });

    return res.status(HTTP.OK).json({
      message: "viewing all abeg",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error",
      data: error.message,
    });
  }
};

export const viewOneBeg = async (req: Request, res: Response) => {
  try {
    const { abegID } = req.params;
    const abeg = await FundModel.findById(abegID);

    return res.status(HTTP.OK).json({
      message: "viewing all abeg",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error",
      data: error.message,
    });
  }
};

export const deleteOneBeg = async (req: Request, res: Response) => {
  try {
    const { abegID } = req.params;
    const abeg = await FundModel.findByIdAndDelete(abegID);

    return res.status(HTTP.OK).json({
      message: "viewing all abeg",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error",
      data: error.message,
    });
  }
};

export const updateOneBeg = async (req: Request, res: Response) => {
  try {
    const { abegID } = req.params;
    const { title, description } = req.body;
    const abeg = await FundModel.findByIdAndUpdate(
      abegID,
      { title, description },
      { new: true }
    );

    return res.status(HTTP.OK).json({
      message: "viewing all abeg",
      data: abeg,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "error",
      data: error.message,
    });
  }
};

// export const giveOneBeg = async (req: Request, res: Response) => {
//   try {
//     const { beggerID, begID, giverID } = req.params;
//     const { amount } = req.body;

//     const begger = await authModel.findById(beggerID);
//     console.log("begger", begger);

//     const giver = await authModel.findById(giverID);
//     console.log("giver: ", giver);

//     const findBeg: any = await FundModel.findById(begID);
//     console.log("beg id :", findBeg);

//     if (begger?.verified) {
//       if (findBeg?.amountNeeded <= 0) {
//         console.log("Beg has been reached");
//         return res.status(HTTP.OK).json({
//           message: "Beg has been reached",
//           data: findBeg,
//           status: HTTP.OK,
//         });
//       } else {
//         const abeg = await FundModel.findByIdAndUpdate(
//           findBeg._id,
//           {
//             amountNeeded: findBeg?.amountNeeded! + parseInt(amount),
//             amountRaised: findBeg?.amountRaised! - parseInt(amount),
//           },
//           { new: true }
//         );
//         return res.status(HTTP.CREATED).json({
//           message: "Done",
//           data: abeg,
//           status: HTTP.CREATED,
//         });
//       }
//     } else {
//       return res.status(HTTP.BAD_REQUEST).json({
//         message: "User not verfied",
//         data: Error,
//         status: HTTP.BAD_REQUEST,
//       });
//     }
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: "Error giving beg",
//       data: error.message,
//       status: HTTP.BAD_REQUEST,
//     });
//   }
// };

export const giveOneBeg = async (req: Request, res: Response) => {
  try {
    const { beggerID, begID, giverID } = req.params;
    const { amount } = req.body;

    const begger = await authModel.findById(beggerID);
    console.log("begger:", begger);

    const giver = await authModel.findById(giverID);
    console.log("giver:", giver);

    const findBeg = await FundModel.findById(begID);
    console.log("beg ID:", findBeg);

    if (!begger || !giver || !findBeg) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User or beg not found.",
        status: HTTP.BAD_REQUEST,
      });
    }

    if (!begger.verified) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Beggar is not verified.",
        status: HTTP.BAD_REQUEST,
      });
    }

    if (findBeg.amountNeeded <= 0) {
      console.log("Beg has been reached");
      return res.status(HTTP.OK).json({
        message: "Beg has been reached.",
        data: findBeg,
        status: HTTP.OK,
      });
    }

    const updatedBeg = await FundModel.findByIdAndUpdate(
      findBeg._id,
      {
        amountNeeded: findBeg.amountNeeded + parseInt(amount),
        amountRaised: findBeg.amountRaised - parseInt(amount),
      },
      { new: true }
    );

    return res.status(HTTP.CREATED).json({
      message: "Transaction successful.",
      data: updatedBeg,
      status: HTTP.CREATED,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error giving beg.",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const searchCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;

    const allBegs = await FundModel.find();

    const filteredItems = allBegs.filter((item: any) => {
      return item.category === category;
    });

    if (filteredItems.length > 0) {
      return res.status(HTTP.OK).json({
        message: `All items under the category "${category}" found.`,
        data: filteredItems,
        status: HTTP.OK,
      });
    } else {
      return res.status(HTTP.NOT_FOUND).json({
        message: `No items found under the category "${category}".`,
        data: [],
        status: HTTP.NOT_FOUND,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error while searching.",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const likeBeg = async (req: Request, res: Response) => {
  try {
    const { userID, begID } = req.params;

    const beg:any = await FundModel.findById(begID);
    const user:any = await authModel.findById(userID);

    if (!beg || !user) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User or beg doesn't exist.",
        status: HTTP.BAD_REQUEST,
      });
    }

    if (beg.like.includes(user._id)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "You cannot like again.",
        status: HTTP.BAD_REQUEST,
      });
    }

    beg.like.push(new Types.ObjectId(user._id));
    await beg.save();

    return res.status(HTTP.CREATED).json({
      message: "Liked successfully.",
      data: beg,
      length: beg.like.length,
      status: HTTP.CREATED,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error liking beg.",
      data: error.message,
      status: HTTP.BAD_REQUEST,
    });
  }
};