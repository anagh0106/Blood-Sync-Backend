const express = require("express")
const router = express.Router();
const RegionController = require("../Controller/AdminController")

router.post("/add", RegionController.addRegion)

module.exports = router