import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js"

const toggeleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video ID")
    }
    const videoExists = await video.exists({ _id: videoId });
    if (!videoExists) {
        throw new ApiError(404, "Video not found ")
    }
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id

    });
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Video unliked successfully"));
    }
    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });
    return res.status
        (200).json(new ApiResponse(200, { isLiked: true }, "Video liked successfully"));

});

const toggelComentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "invalid comment Id");
    };
    const existComment = await Comment.findOne(
        {
            _id: commentId,
        }
    );
    if (!existComment) {
        throw new ApiError(404, "comment not found")
    };
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "comment unlike successfully"));
    };

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res.status(200).json(new ApiResponse(200, { isLiked: true }, "comment liked successfully"))
});
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweet id ");
    };
    const existTweet = await Tweet.findOne(
        {
            _id: tweetId
        }
    )
    if (!existTweet) {
        throw new ApiError(404, "Tweet not found")
    }
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Tweet unliked sucessfully"));
    };

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });
    res.status(200).json(new ApiResponse(
        200, 
        { isLiked: true }, 
        "Tweeet liked succesfully"))




});


export {
    toggeleVideoLike,
    toggelComentLike,
    toggleTweetLike
}