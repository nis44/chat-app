import { asyncHandler } from "../utils/asyncHandler.js";
import { apierror } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// const getUserForSidebar = asyncHandler(async (req, res) => {
//     const loggedInUserId = req.user._id;

//     const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
//     res.status(200).json(
//         new apiResponse(200, filteredUsers, "Users fetched successfully")
//     );
// });

// const getMessages = asyncHandler(async (req, res) => {
//     const { id: UserToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//         $or: [
//             { senderId: myId, recieverId: UserToChatId },
//             { senderId: UserToChatId, recieverId: myId },
//         ],
//     }).sort({ createdAt: 1 });

//     res.status(200).json(
//         new apiResponse(200, messages, "Messages fetched successfully")
//     );
// });

// const sendMessages = asyncHandler(async (req, res) => {
//     const { text, image } = req.body;
//     const { id: recieverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl = null;

//     if (image) {
//         try {
//             const uploadResult = await uploadOnCloudinary(image);
//             imageUrl = uploadResult.url;
//         } catch (error) {
//             throw new apierror(500, "Failed to upload image");
//         }
//     }

//     const newMessage = new Message({
//         senderId,
//         recieverId,
//         text: text || null,
//         image: imageUrl,
//     });

//     await newMessage.save();

//     res.status(201).json(
//         new apiResponse(201, newMessage, "Message sent successfully")
//     );
// });

const getUserForSidebar = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.aggregate([
        { $match: { _id: { $ne: mongoose.Types.ObjectId(loggedInUserId) } } },
        { $project: { password: 0 } } // Exclude the password field
    ]);

    res.status(200).json(
        new apiResponse(200, filteredUsers, "Users fetched successfully")
    );
});

const getMessages = asyncHandler(async (req, res) => {
    const { id: UserToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderId: mongoose.Types.ObjectId(myId), recieverId: mongoose.Types.ObjectId(UserToChatId) },
                    { senderId: mongoose.Types.ObjectId(UserToChatId), recieverId: mongoose.Types.ObjectId(myId) },
                ],
            },
        },
        { $sort: { createdAt: 1 } } // Sort by createdAt in ascending order
    ]);

    res.status(200).json(
        new apiResponse(200, messages, "Messages fetched successfully")
    );
});

const sendMessages = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    if (image) {
        const uploadResult = await uploadOnCloudinary(image);
        imageUrl = uploadResult.url;
    }

    if(!imageUrl) {
        throw new apierror(500, "Failed to upload avatar");
    }

    const newMessage = await Message.create({
        senderId,
        recieverId,
        text: text || null,
        image: imageUrl || null,
    });

    await newMessage.save();

    res.status(201).json(
        new apiResponse(201, newMessage, "Message sent successfully")
    );
});


export { getMessages, getUserForSidebar, sendMessages };
