import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: 'dgkhrnvli',
    api_key: '344555844332632',
    api_secret: 'sUfglC2WkyfLimwBJJy-PZ4ZAf4',
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            console.error("No local file path provided");
            return null;
        }
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        console.log(response.url, "file uploaded successfully");
        return response;
        
    } catch (error) {
        fs.unlinkSync(localfilepath);
        return null;
    }
}

export {uploadOnCloudinary}