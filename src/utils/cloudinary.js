
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "image",
                use_filename: true,
                unique_filename: true
            }
        );

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        return null;
    } finally {
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (fileError) {
            console.error(
                "Temporary file deletion failed:",
                fileError.message
            );
        }
    }
};

export { uploadOnCloudinary };
