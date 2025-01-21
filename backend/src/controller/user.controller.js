import { asyncHandler } from "../utils/asyncHandler.js";
import { apierror } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apierror(
            500,
            "something went wrong while generating access and refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apierror(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existedUser) {
        throw new apierror(400, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
        throw new apierror(400, "avatar image are required");
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    if (!avatarUrl?.url) {
        throw new apierror(500, "Failed to upload images");
    }

    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatarUrl.url,
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken")
        .lean();

    if (!createdUser) {
        throw new apierror(500, "Failed to retrieve created user");
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                { user: createdUser },
                "User created successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new apierror(400, "Email and username are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new apierror(404, "User not found");
    }

    const ispasswordvalid = await user.isPasswordCorrect(password);

    if (!ispasswordvalid) {
        throw new apierror(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "user loggedIn SuccessFully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});

const refreshAccesstoken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new apierror(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apierror(401, "Unauthorized refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apierror(401, "refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new apierror(401, "Unauthorized request");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        throw new apierror(400, "Password does not match");
    }

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new apierror(401, "Invalid password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .json(new apiResponse(200, { user }, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, email} = req.body;

    if(!fullname && !email) {
        throw new apierror(400, "fullname or email is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {fullname, email} 
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new apiResponse(200, {user}, "Account details updated successfully"));

});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath)

    if (!avatarLocalPath) {
        throw new apierror(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new apierror(500, "Failed to upload avatar");
    }

    // Use .lean() to avoid circular structure and return plain JavaScript object
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    )
    .select("-password -refreshToken")
    .lean(); // This returns a plain JavaScript object instead of a Mongoose document

    if (!user) {
        throw new apierror(404, "User not found");
    }

    return res.status(200).json(new apiResponse(200, { user }, "Avatar updated successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccesstoken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
};