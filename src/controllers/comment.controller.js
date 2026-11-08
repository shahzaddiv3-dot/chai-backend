
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { video } from "../models/video.model.js";
import { isValidObjectId } from "mongoose";



const addComment = asyncHandler (async(req,res)=>{
    const {videoId} = req.params;
    const {content} = req.body;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid  video id ")
    }
    const videoFound = await video.findById(videoId)
    if (!videoFound) {
        throw new ApiError(404,"Video not Found ")
    }
    if  ( typeof content!== "string" || content.trim().length === 0) {
        throw new ApiError(400,"Comment content is required")
    }
  const createdComment =  await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
});
return res.status(201).json(new ApiResponse(201,createdComment,"Comment Done"))

});
const getVideoComment = asyncHandler (async(req,res) =>{
    const {videoId} =  req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid Video Id")
    }
const videoFound = await video.findById(videoId)
if (!videoFound) {
    throw new ApiError(404,"Video not found")
}
    const comments = await Comment.find({video :videoId}).populate("owner","username vatar FullName");  
    return res.status(200).json( new ApiResponse(200,comments,"  Video Comment fetched successfully"))

})
export{
    addComment,
    getVideoComment
}