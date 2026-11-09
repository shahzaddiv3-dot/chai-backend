
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";


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
})
export  {creatTweet}