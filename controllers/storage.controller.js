const aws = require("aws-sdk");
const uuid = require("uuid");
const s3 = new aws.S3({
  endpoint: process.env.R2_S3_API_URL,
  accessKeyId: process.env.R2_API_KEY_ID,
  secretAccessKey: process.env.R2_API_ACCESS_TOKEN,
  signatureVersion: "v4",
});

const getUploadUrl = async (req, res) => {
  const { extension, type } = req.body;
  if (extension) {
    if (
      !(
        extension == "png" ||
        extension == "jpg" ||
        extension == "jpeg" ||
        extension == "svg" ||
        extension == "mp4" ||
        extension == "mov" ||
        extension == "avi" ||
        extension == "wmv" ||
        extension == "flv" ||
        extension == "mkv" ||
        extension == "webm" ||
        extension == "3gp"
      )
    ) {
      return res.status(404).json({
        success: false,
        message: "extension is must be one of [png, jpg, jpeg, svg]",
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: "extension is required",
    });
  }

  if (!type) {
    return res.status(404).json({
      success: false,
      message: "type is required & must be one of [Services, Food , Avatar]",
    });
  }
  const name = uuid.v4();
  const key = `${type}/${name}.${extension}`;

  try {
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Expires: 36000,
      ContentType: "application/octet-stream",
    });

    const baseStorageUrl = process.env.STORAGE_URL;
    const downloadUrl = `${baseStorageUrl}/${key}`;

    const response = {
      uploadUrl: url,
      success: true,
      fileName: name,
      downloadUrl: downloadUrl,
      key: key,
    };
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: "Something went wrong",
      error: e,
    });
  }
};

module.exports = { getUploadUrl };
