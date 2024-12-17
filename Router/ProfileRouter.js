const profileController = require("../Controller/ProfileController")
const express = require("express")
const router = express.Router();

router.post("/", profileController.uploadFile)

module.exports = router