const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const os = require('os');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (buffer, fileName, folder = 'bank-app') => {
  const tempFilePath = path.join(os.tmpdir(), fileName);
  fs.writeFileSync(tempFilePath, buffer);

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder,
      resource_type: 'auto',
    });
    fs.unlinkSync(tempFilePath); // Clean up
    return result.secure_url;
  } catch (err) {
    fs.unlinkSync(tempFilePath); // Clean up even if error
    throw err;
  }
};

module.exports = uploadToCloudinary;
