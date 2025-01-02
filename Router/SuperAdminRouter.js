const express = require("express")
const router = express.Router();
const LoginController = require("../Controller/LoginController")
const signupController = require("../Controller/SignupController")
const hospitalController = require("../Controller/HospitalController")
const AuthMiddleware = require("../Middleware/AuthMiddleware")
const AdminController = require("../Controller/AdminController")
// Super Admin Welcome
router.get(
    "/get",
    AuthMiddleware.verifyToken,
    (req, res) => {
        res.status(200).json({
            message: "Welcome Back Super Admin !",
        });
    }
);

// Rights Of Admin For User/Admin
router.get(
    "/getAllUser",
    AuthMiddleware.verifyToken,
    signupController.getAllUser,
);
router.delete(
    "/deleteUser",
    AuthMiddleware.verifyToken,
    signupController.deleteUser,
);
router.put(
    "/updateUser",
    AuthMiddleware.verifyToken,
    signupController.UpdateDetails,
);
router.post(
    "/addUser",
    signupController.AddUser,
);

// Admin Login/SignUp
router.post(
    "/adminLogin",
    AdminController.AdminLogin,
);
router.post(
    "/addAdmin",
    AdminController.AddAdmin,
);

router.delete(
    "/deleteAdmin",
    AuthMiddleware.verifyToken,
    AdminController.deleteAdmin,
);
router.put(
    "/updateAdmin",
    AuthMiddleware.verifyToken,
    AdminController.updateAdmin,
);

// Rights Of Admin For Hospital 
router.get(
    "/getAllHospital",
    AuthMiddleware.verifyToken,
    hospitalController.getAllHospital,
);
router.delete(
    "/deleteHospital",
    AuthMiddleware.verifyToken,
    hospitalController.deleteHospital,
);
router.put(
    "/updateHospital",
    AuthMiddleware.verifyToken,
    hospitalController.update,
);
router.post(
    "/addHospital",
    AuthMiddleware.verifyToken,
    hospitalController.AddHospital,
);

module.exports = router;