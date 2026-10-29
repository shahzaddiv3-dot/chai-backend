import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { video } from "../models/video.model.js";


const publishVideo = asyncHandler(async (req, res) => {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const videoLocalPath = req.files?.videoFile?.[0].path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }
    if (!videoLocalPath) {
        throw new ApiError(400, "video file is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    const videoUploaded = await uploadOnCloudinary(videoLocalPath)
    if (!videoUploaded?.url) {
        throw new ApiError(500, "Error uploading video to Cloudinary")
    }
    const thumbnailUploaded = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnailUploaded?.url) {
        throw new ApiError(500, "Error uploading thumbnail to Cloudinary")
    }
    const duration = videoUploaded.duration;
    const createdVideo = await video.create({
        videoFile: videoUploaded.url,
        thumbnail: thumbnailUploaded.url,
        title,
        description,
        duration,
        owner: req.user._id
    });
    return res
        .status(201)
        .json(new ApiResponse
            (201, createdVideo, "Video published successfully"))
});
const getAllVideos = asyncHandler(async (req, res) => {
    const page = Number(req.query.page ?? 1) ;
    const limit = Number(req.query.limit ?? 10);

    if ( !Number.isInteger(page) || page <= 0) {
        throw new ApiError(400, "Page must be positive integer ")
    };
    if ( !Number.isInteger(limit) || limit <= 0) {
        throw new ApiError(400, "Limit must be positive number ")
    };
    const skip = (page - 1) * limit;
    const totalVideos = await video.countDocuments({
        isPublished:true,
    });
    const totalPages = Math.ceil(totalVideos / limit);
    const videos = await video.find({
        isPublished: true,
    }).skip(skip).limit(limit)
    return res
        .status(200)
        .json(new ApiResponse
            (200,
                { videos, currentPage: page, limit,totalVideos,totalPages }
                , "Videos Fetched Successfully"))
})

export {
    publishVideo,
    getAllVideos,
   
};