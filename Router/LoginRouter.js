const express = require("express")
const router = express.Router();

const LoginController = require("../Controller/LoginController")
const LoginValidation = require("../Util/LoginValidation")
const Validation = require("../Middleware/zodMiddleware")

router.post("/", Validation.UserValidation(LoginValidation), LoginController.loginUser)
router.post("/otp", LoginController.SendOTPToMail)
router.post("/verify", LoginController.verifyOTP)
router.post("/pass", LoginController.showPassword)

module.exports = router;