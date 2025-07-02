const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (fileBuffer, fileName, mimetype) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: "public-read", // or your preferred ACL
  };

  return s3.upload(params).promise();
};

module.exports = uploadToS3;
