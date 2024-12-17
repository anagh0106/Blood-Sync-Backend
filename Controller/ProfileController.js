
// New Code For Testing Purpose

const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("./CloudinaryController");

// Ensure Images directory exists
if (!fs.existsSync('./Images')) {
    fs.mkdirSync('./Images');
}

// multer is a middleware which is used to uploading files in Node.js Applications
// it is also used to handle form data
const storage = multer.diskStorage({ // diskstorage is used to define custom storage option
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true);
        }
        else {
            return cb(new Error("Only .png, .jpg and .jpeg formats are supported!"))
        }
    }
}).single("file")

const uploadFile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                });
            }
            else {
                if (req.file) {
                    const result = await cloudinary.uploadFile(req.file);

                    res.status(200).json({
                        message: "File uploaded successfully",
                        data: req.file,
                        cloudinaryData: result
                    })
                }
                else {
                    res.status(400).json({
                        message: "File not found",
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).json({
            message: err,
            error: err
        });
    }
}

module.exports = {
    uploadFile
};
