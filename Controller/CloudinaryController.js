const cloudinary = require("cloudinary").v2;

const uploadFile = async (file) => {
    cloudinary.config({
        cloud_name: "dnp5v5trt",
        api_key: "261326284545173",
        api_secret: "UcdZ8BvvvMgmtS3-Ek4w4BHouGY"
    })
    const result = await cloudinary.uploader.upload(file.path)
    console.log(result);
    return result

}
module.exports = {
    uploadFile
}