const express = require("express")
const router = express.Router();
const SignupController = require("../Controller/SignupController");
const validation = require("../Middleware/zodMiddleware")
const signupValidation = require("../Util/SignUpValidation")

router.post("/", validation.UserValidation(signupValidation), SignupController.AddUser)
router.get("/get", SignupController.getAllUser)
router.put("/update", SignupController.UpdateDetails)
router.delete("/delete", SignupController.deleteUser);
module.exports = router