const express = require("express")
const router = express.Router();
const SignupController = require("../Controller/SignUpController")
const validation = require("../Middleware/zodMiddleware")
const signupValidation = require("../Util/SignUpValidation")

router.post("/add", validation.UserValidation(signupValidation), SignupController.SignUpUser)
router.get("/get", SignupController.getAllUser)
router.put("/update", SignupController.UpdateDetailsByEmail)
router.delete("/delete", SignupController.deleteUserByEmail);
module.exports = router