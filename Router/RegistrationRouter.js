const express = require("express")
const router = express.Router();
const donationform = require("../Controller/DonationForm")

router.post("/", donationform.AddData)

module.exports = router