const express = require("express")
const router = express.Router();
const donationform = require("../Controller/DonationForm")
const registrationValidation = require("../Util/DonationFormValidation")
const validation = require("../Middleware/zodMiddleware")

router.post("/", validation.UserValidation(registrationValidation),donationform.AddData)

module.exports = router