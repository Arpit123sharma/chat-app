import {v2 as cloudinary } from "cloudinary"
import {ApiError} from "./error.js"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:663962616389728,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//console.log(process.env.CLOUDINARY_API_KEY);

const uploadOnCloudinary = async(filepath)=>{
   try {
      if(!filepath?.trim()) throw new ApiError(500,"plz give the file path to upload on the cloud");

      const uploadedImage = await cloudinary.uploader.upload(filepath,{
           resource_type:"auto"
      })

      if (!uploadedImage) {
        throw new ApiError(500,"internal server error :: something went wrong while uploading image on cloudinary !! ")
      }

      //console.log("data of uploadedImage.........",uploadedImage);
      fs.unlinkSync(filepath);
      return uploadedImage;

   } catch (error) {
      console.error("error while uploading a file on the cloudinary :: ",error);
      fs.unlinkSync(filepath);
   }
}

export {uploadOnCloudinary}