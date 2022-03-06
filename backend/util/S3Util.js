// Code adapted from youtube - @ Sam Meech-Ward
// @youtube https://www.youtube.com/watch?v=NZElg91l_ms
// @github https://github.com/Sam-Meech-Ward/image-upload-s3
// @author Mohak Vaswani

const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const config = require("../config");

const bucketName = config.amazons3.bucket_name;
const region = config.amazons3.bucket_region;
const accessKeyId = config.amazons3.access_key;
const secretAccessKey = config.amazons3.secret_key;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

// delete file from s3

function deleteFileAWS(fileKey) {
  const fileParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.deleteObject(fileParams).promise();
}

function Download(fileKey) {
  const fileParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(fileParams).promise();
}

module.exports = { uploadFile, deleteFileAWS, getFileStream, Download };
