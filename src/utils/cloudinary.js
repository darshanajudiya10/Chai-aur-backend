// import cloudinary from 'cloudinary';
// import fs from 'fs';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadToCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;
//         const resourse = await cloudinary.v2.uploader.upload(localFilePath,{
//             resource_type: "auto"
//         }) 
//         //file has been uploaded successfully
//         console.log("file is uploaded on cloudinary",response.url);
//         return reponse;

//     } catch (error) {
//         fs.unlinkSync(localFilePath) //remove the locally save as the upload operation got failed
//         return null;
//     }
// }

// export { uploadToCloudinary };


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // console.log("✅ File uploaded to Cloudinary:", response.url);

        // delete local file after upload
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.log("❌ Cloudinary upload error:", error.message);

        // delete file if upload fails
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadToCloudinary };