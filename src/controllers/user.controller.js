// import { asyncHandler } from "../utils/asyncHandler.js";
// import {ApiError} from "../utils/ApiError.js"
// import {User} from "../models/user.model.js"
// import { uploadToCloudinary } from "../utils/cloudinary.js";    
// import { ApiResponse } from "../utils/ApiResponse.js";  
// import { log } from "console";

// const registerUser = asyncHandler(async (req, res) => {
    
//     // get user details from frontend
//     // validation - not empty
//     // check if user already exists : username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in database
//     // remove password and refresh token field from response
//     // check for user creation 
//     // return response

//     const {fullname, username, password, email} = req.body
//     console.log("email: ", email);
//     if (
//     [fullname, username, password, email].some(
//         (field) => !field || field.trim() === ""
//     )) {
//         throw new ApiError(400, "All fields are required")
//     }
    
//     const existUser = await User.findOne({
//         $or: [
//             {username},
//             {email}
//         ]
//     })
//     if (existUser) {
//         throw new ApiError(400, "User already exists")
//     }
    
//     const avatarLocalPath = req.files?.avatar?.[0]?.path;
   
//     console.log("avatarLocalPath:", avatarLocalPath); 

//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//     if(!avatarLocalPath){
//         throw new ApiError(400, "Avatar is required")
//     }
    
//     const avatar = await uploadToCloudinary(avatarLocalPath)
//     const coverImage = await uploadToCloudinary(coverImageLocalPath)

//     // log("avatar: ", avatar);

//     if (!avatar) {
//         throw new ApiError(500, "Error while uploading avatar")
//     }

//     const user = await User.create({
//         fullname,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         username: username.toLowerCase(),
//         password,
//         email
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if(!createdUser){
//         throw new ApiError(500, "Error while creating user")
//     }

//     return res.status(201).json(
//         new ApiResponse(201, createdUser, "User registered successfully")
//     )


// })

// export { registerUser }




import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    // 1. Get user data
    const { fullname, username, password, email } = req.body;

    // // console.log("📩 Email:", email);

    // 2. Validate fields
    if (
        [fullname, username, password, email].some(
            (field) => !field || String(field).trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check existing user
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existUser) {
        throw new ApiError(400, "User already exists");
    }

    // 4. Handle files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // console.log("📁 Avatar path:", avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // 5. Upload avatar
    const avatar = await uploadToCloudinary(avatarLocalPath);
    // console.log("🖼 Avatar upload:", avatar);

    if (!avatar) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    // 6. Upload cover image (optional)
    let coverImage = null;

    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }

    // 7. Create user
    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // 8. Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Error while creating user");
    }

    // 9. Send response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };