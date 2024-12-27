const express = require("express")
const router = express.Router();

const LoginController = require("../Controller/LoginController")
// const LoginValidation = require("../Util/LoginValidation")
// const Validation = require("../Middleware/zodMiddleware")

router.post("/", LoginController.loginUser)
router.post("/forgotpassword", LoginController.SendOTPToMail)
router.post("/verify", LoginController.verifyOTP)
router.post("/update", LoginController.updatePassword)

// router.post("/logout", LoginController.logout)
// router.post('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             res.status(500).json({ message: "Logout failed" });
//         } else {
//             res.clearCookie('connect.sid'); // Clear the session cookie
//             res.status(200).json({ message: "Logged out successfully" });
//         }
//     });
// });

module.exports = router;