import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const streamUpload = async (req: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error: any, result: any) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve(result);
        }
      }
    );

    streamifier.createReadStream(req?.file?.buffer!).pipe(stream);
  });
};