import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import asyncHandler from "../utils/asyncHandler.js";




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
})

export{creatPlayList
}