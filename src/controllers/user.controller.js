import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler (async(req,res)=>{
// get  user details from frontend
// validation not empty 
// check  if user already  exist  : username,email
// check for image check for avatar
// upload them to cloudinary , avatar
// creat user object - creat entry in db 
//  remove password nad refresh token  fieldfrom response
// check for user creation 
// return res
const  {fullName,  email, userName,password,} = req.body()
console.log("email",email);
if ([fullName,email,userName,password].some((field)=>
field?.trim() === "")
) {
    throw new ApiError (400,"All fields are required")
}
const existedUser = UserActivation.find({
    $or : [{userName}, {email}]
})
if (existedUser) {
    throw new ApiError(409,"uuer with email or username is already exists")
}
 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if (avatarLocalPath) {
    throw new ApiError(400,"Avatar field is required")
 }
 const avatar  = await uploadOnCloudinary(avatarLocalPath)
 const coverImage  = await uploadOnCloudinary(coverImageLocalPath)
 if (!avatar) {
     throw new ApiError(400,"Avatar field is required")
    
 }
  const user  = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.tolowerCase()
 })
 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )
 if (!createdUser) {
    throw new ApiError(500,"some thing went wrong while registering the user")
 }
 return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
 )
})





export {registerUser}






