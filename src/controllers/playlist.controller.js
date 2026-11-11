import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { video } from "../models/video.model.js";
import mongoose from "mongoose";




const creatPlayList = asyncHandler(async(req,res)=>{
const {name,description} = req.body;
if (!name || !description) {
    throw new ApiError(400,"name and description are required")
}
const playlist = await Playlist.create(
    {
        name,
        description,
        owner: req.user._id
    }
)
return res.status(201).json(new ApiResponse(201,playlist,"playlist creat successfully"))
});
 const getUserPlaylists = asyncHandler(async(req,res) =>{
const playlistFound = await Playlist.find({
    owner:req.user._id
 })
 return res.status(200).json(new ApiResponse(200,playlistFound,"user playlist fetched successfully"))

 });
 const getPlaylistById = asyncHandler(async(req,res) =>{
const {playListId} = req.params
if (!mongoose.isValidObjectId(playListId)) {
    throw new ApiError(400,"Invalid playlist id")
}
 const playlistFound  = await  Playlist.findOne({
    _id: playListId,
    owner:req.user._id
});
if (!playlistFound) {
    throw new ApiError(404,"Playlist not found")
}
return res.status(200).json(new ApiResponse(200,playlistFound,"Playlist fetched successfully"))
 });
 const addVideoToPlaylist = asyncHandler(async(req,res) =>{
    const {videoId} = req.body;
    const {playListId} = req.params;

    if (!mongoose.isValidObjectId(videoId)
    ||!mongoose.isValidObjectId(playListId)) {
        throw new ApiError(400,"Invalid video Id and playlist Id")
    }
    const videoFound = await video.findById(videoId)
    if (!videoFound) {
        throw new ApiError(404,"Video not existed")
    };
      const playlistFound =  await Playlist.findOne({
        _id: playListId,
        owner: req.user._id

    });
    if (!playlistFound) {
        throw new ApiError(404,"playlist are not exist")
    }
    playlistFound.videos.addToSet(videoId);
     await playlistFound.save()
    return res.status(200).json( new ApiResponse(200,playlistFound,"Video added in playlist successfully"))
  
 });
 const removeVideoFromPlaylist = asyncHandler(async(req,res) =>{
const {playListId,videoId} = req.params;

if (!mongoose.isValidObjectId(playListId) || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400,"Invalid playlist id and video id ")
}
const playlistFound = await Playlist.findOne(
    {
_id:playListId,
owner:req.user._id
    }
)
if (!playlistFound) {
    throw new ApiError(404,"playlist not found ")
}
playlistFound.videos.pull(videoId);
await playlistFound.save();
return res.status(200).json(new ApiResponse(200,playlistFound,"Video removed  from playlist sucessfully"))
 });
 const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playListId} = req.params;
    if (!mongoose.isValidObjectId(playListId)) {
        throw new ApiError(400,"Invalid playlist id")
    } 
    const deletedPlaylist = await Playlist.findOneAndDelete(
        {
            _id:playListId,
            owner:req.user._id
        }
    )
    if (!deletedPlaylist) {
        throw new ApiError(404,"playlist are  not found")
    }
   return res.status(200).json(new ApiResponse(200,deletedPlaylist,"Video delete from playlist successfully"))
 })

export{creatPlayList,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
}