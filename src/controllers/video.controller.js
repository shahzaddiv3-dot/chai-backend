import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { video } from "../models/video.model.js";
import mongoose from "mongoose"


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
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1 ;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page -1 : null ;
    const videos = await video.find({
        isPublished: true,
    }).skip(skip).limit(limit)
    return res
        .status(200)
        .json(new ApiResponse
            (200,
                { videos, 
                    currentPage: page, 
                    limit,
                    totalVideos,
                    totalPages,
                    hasNextPage,
                     hasPrevPage,
                     nextPage,
                     prevPage }
                , "Videos Fetched Successfully"))
});
const getVideoById = asyncHandler (async (req,res)=>{
const {videoId } = req.params;
if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400,"Invalid video Id")
};
const videoFound = await video.findById(videoId)
if (!videoFound) {
    throw new ApiError(404,"Video not found ")
};
return res.status(200)
.json(new ApiResponse(200,
  videoFound  ,
    "Video fetched successfully"
))
});
const videoUpdate = asyncHandler(async(req,res)  =>{
const {videoId} = req.params;
if (!mongoose.isValidObjectId (videoId)) {
    throw new ApiError(400,"INvalid Video Id")
};
const videoFound = await video.findOne({
    _id : videoId,
    owner : req.user._id
})

if (!videoFound) {
    throw new ApiError(404,"Video not found ")
}
const {title,description} = req.body;
const thumbnailLocalPath =  req.file?.path;
const updateFields = {}
let thumbnailUploaded ;
if (title) {
    updateFields.title = title.trim();
}
if (description) {
    updateFields.description = description.trim();
}

if (thumbnailLocalPath) {
     thumbnailUploaded = await uploadOnCloudinary(thumbnailLocalPath)
     if (!thumbnailUploaded?.url) {
    throw new ApiError(500,"Error uploading thumbnailto cloudinary")
}
};
if (thumbnailLocalPath) {
    updateFields.thumbnail = thumbnailUploaded.url;
}

if (Object.keys(updateFields).length === 0 ) {
    throw new ApiError(400,"At least one field is required to update")
}

Object.assign(videoFound,updateFields)
await videoFound.save()
return res.status(200).json(new ApiResponse(200,videoFound,"Video update successfully"))
});

const deleteVideo = asyncHandler(async(req,res) =>{
    const {videoId} = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400," invalid video Id")
    }
    const videoFound = await video.findOne({
        

        _id : videoId,
        owner: req.user._id

  })
  if (!videoFound) {
    throw new ApiError(404,"video not found")    
  }
  await videoFound.deleteOne()

  return res.status(200).json(new ApiResponse(200, videoFound,"Video delete successfully"))
});
const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video id ")
    }
    const videoFound = await video.findOne(
        {
            _id: videoId,
            owner: req.user._id
        }
    )
if (!videoFound) {
    throw new ApiError(404,"Video not found -")
}
videoFound.isPublished = !videoFound.isPublished;
 await videoFound.save();
return res.status(200).json(new ApiResponse(200,videoFound,"video published status update successfully"))
});
const incrementVideoViews = asyncHandler(async(req,res) =>{
    const {videoId} = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video id ")
        
    }
    const videoFound = await video.findByIdAndUpdate(
        videoId,
        {$inc: {views: 1 }},
    {new : true}
    )



if (!videoFound) {
    throw new ApiError(404,"vIDEO NOT FOUND")
}
return res.status(200).json(new ApiResponse(200,videoFound,"Video views incremented successfully"))
}) 



// const deleteVideo = asyncHandler(async(req,res)=>{
//    const {videoId}  = req.params; 
//     if (!mongoose.isValidObjectId(videoId)) {
//         throw new ApiError(400,"invalid video id ")
//     }
// const videoFound = await video.findOne({
//     _id :  videoId,
//     owner: req.user._id
// })
// if (!videoFound) {
//     throw new ApiError(404,"video not found ")
// }
//  await videoFound.deleteOne();
// return res.status(200).json(new ApiResponse(200,"video deelete successfully "))
// });

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    videoUpdate,
    deleteVideo,
    togglePublishStatus,
    incrementVideoViews
    
   
};