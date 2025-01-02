const express = require("express")
const router = express.Router();

const LoginController = require("../Controller/LoginController")
const signupController = require("../Controller/SignupController")
const hospitalController = require("../Controller/HospitalController")
const AuthMiddleware = require("../Middleware/AuthMiddleware")
// const RBAC = require("../Middleware/RoleMiddleware")

router.post("/", LoginController.loginUser)
router.post("/forgotpassword", LoginController.SendOTPToMail)
router.post("/verify", LoginController.verifyOTP)
router.post("/update", LoginController.updatePassword)

module.exports = router;