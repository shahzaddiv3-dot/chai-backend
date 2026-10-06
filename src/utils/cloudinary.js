import {v2 as cloudinary} from "cloudinary"
import { response } from "express";




    cloudinary.config({ 
        cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret:  process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath)=>{
try {
    if(!localFilePath) return null
    // upload file on cloudinary 
    const response =  await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto" 
    })
   // file has been upload succesfully //
   console.log("file is uploaded on cloudinary", response.url);
   return response
} catch (error) {
    fs.unlinksync(localFilePath) // remove the locaally saved temprory file as the upload oprationgot failed
    return null
}
    }
    export {uploadOnCloudinary}