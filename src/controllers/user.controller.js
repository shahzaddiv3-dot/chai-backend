
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
       const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "somthing went worng ")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { FullName, email, username, password } = req.body;

    if ([FullName, email, username, password].some(
        (field) => !field?.trim()
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists"
        );
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    const user = await User.create({
        FullName: FullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});
const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or  email
    // find the user 
    // password check 
    // access and refresh token 
    // send cokie 
    const { username, email, password } = req.body
  if ((!username && !email) || !password) {
    throw new ApiError(
        400,
        "Username or email and password are required"
    );
}
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("AccessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                },
                "user loggedIn succesfully"
            )
        )

});
const logoutUser = asyncHandler(async (req, res) => {
  await   User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
 
    const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized request")
    }
 try {
     const decodedToken =   jwt.verify(
           incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
       )
       const user =  await User.findById( decodedToken?._id  )
       if (!user) {
           throw new ApiError(401,"invalid refersh TOken")
       }
       if (incomingRefreshToken !== user?.refreshToken) {
              throw new ApiError(401,"Referesh Token is expired or used")
       }
       const options = {
           httpOnly: true,
           secure:true
       }
      const {accessToken,newRefreshToken} =  await generateAccessAndRefereshTokens(user._id)
       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refereshToken",newRefreshToken,options)
       .json(
            new ApiResponse(
               200,
               {accessToken,refreshToken:newRefreshToken},
               "Access Token efreshed"
            )
       )
 } catch (error) {
    throw new ApiError(401,error?.message || "invalid refreshToken")
 }
});
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.
    isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400,"invalid old Password")
    }
    user.password = newPassword
     await user.save({validateBeforeSave:false})
     return res
     .status(200)
     .json(new ApiResponse(200,{}, "password change successfully"))
});
const getCurrentUser = asyncHandler(async(req,res) =>{
    return res
    .status(200)
    .json(200,req.user, "current user fetched succesfully")
});
const updateAccountDetails = asyncHandler(async(req,res)=>{
 const {FullName,email} = req.body
 if (!FullName || !email) {
    throw new ApiError(400,"All fields are required")
 }
const user =  User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            FullName,
            email:email
        }
    },
    {new:true}
 ).select("-password")
 return res.status(200)
 .json(new ApiResponse(200,user,"Account details update sucessfully"))
})
const updateUserAvatar = asyncHandler(async(req,res)=>{
     const avatarLocalPath = req.file?.path
     if (!avatarLocalPath) {
throw new ApiError(400,"Avatar file is missing")
     }
    const avatar =  await  uploadOnCloudinary(avatarLocalPath)
    if (!avatar || !avatar.url) {
        throw new ApiError(400,"Error while uploading on avatar")
    }
   const user = await  User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")
       return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Useravatar update Successfully")
    )
})
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400,"Cover Image file is mising")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage ||!coverImage.url) {
        throw new ApiError(400,"Error while uploading on CoverImage")
    }
      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"CoverImage update Successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage
};
