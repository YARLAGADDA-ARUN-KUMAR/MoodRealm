import asyncHandler from 'express-async-handler';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

const uploadBufferToCloudinary = (fileBuffer, folder = 'moodrealm/posts') =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            },
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    try {
        const result = await uploadBufferToCloudinary(req.file.buffer);

        res.status(201).json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        throw new Error('Failed to upload image');
    }
});

export { uploadImage };
