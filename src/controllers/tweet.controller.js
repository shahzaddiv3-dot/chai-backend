
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";


const creatTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if ( typeof content !== "string" || content.trim() === "") {
        throw new ApiError(400,"Tweet content is required")
    }
   const createdTweet =  await Tweet.create({
        content:content.trim(),
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201,createdTweet,"Tweet created successfully"))
});
const getAllTweet = asyncHandler (async(req,res)=>{
    const getTweet = await Tweet.find({owner:req.user._id} )
    return res.status(200).json( new ApiResponse(200,getTweet,"Tweet fetched successfully"))
});
const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params;
    const {content} = req.body;
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid tweet Id")
        
    }
    const tweetFound = await Tweet.findOne(
        {
            _id: tweetId,
            owner: req.user._id
        }
    )
    if (!tweetFound) {
        throw new ApiError(404,"Tweet not found")
    }
    if (typeof content !== "string" || content.trim()==="" ) {
        throw new ApiError(400,"tweet content is required")
    }
    tweetFound.content  = content.trim();
    await tweetFound.save();
return res.status(200).json(new ApiResponse(200,tweetFound,"Tweet update successFully"))
});
const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} =  req.params;
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid tweet Id")
    }
    const tweetFound = await Tweet.findOne(
        {
            _id:tweetId,
            owner: req.user._id
        }
    )
    if (!tweetFound) {
        throw new ApiError(404,"Tweet are not found")
        
    }
    await tweetFound.deleteOne();
    return res.status(200).json(new ApiResponse(200, null,"Tweet delete successFully"))
})
export  {creatTweet,
    getAllTweet,
    updateTweet,
    deleteTweet
}