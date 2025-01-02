const adminRegions = require("../Model/AdminRegionsModel.js")
const AdminModel = require("../Model/AdminModel.js")
const superAdminLoginModel = require("../Model/AdminLoginModel.js")
const mailer = require("../Util/MailUtil.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const addRegion = async (req, res) => {
    try {
        const regionData = req.body;

        if (!regionData) {
            return res.status(400).json({ message: "Please fill all fields." })
        }
        const createdRegion = await adminRegions.create(regionData);

        if (!createdRegion) {
            res.status(404).json({
                message: "Region not created"
            })
        }
        res.status(201).json({
            message: "Region created successfully",
            data: createdRegion
        })

    } catch (error) {
        res.status(404).json({
            message: "Failed to add region",
            error: error.message
        })
    }
}
const AddAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email already exists in the signup table
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email.",
            });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object for the signup table
        const AdminObject = { ...req.body, password: hashedPassword };

        // Save user to the signup table
        const SaveAdmin = await AdminModel.create(AdminObject);
        // if (saveUser.role === "Super Admin" || saveUser.role === "Admin") {
        //     // await
        // }
        if (SaveAdmin) {
            // Send a JSON response with a redirect URL
            return res.status(201).json({
                message: "User created successfully",
                userData: SaveAdmin,
                redirectUrl: "/signin", // Provide this for frontend redirection
            });
        } else {
            return res.status(400).json({
                message: "Failed to create user",
            });
        }
    } catch (error) {

        // Handle generic errors
        return res.status(500).json({
            message: "An error occurred during signup. Please try again later.",
            error: error.message,
        });
    }
}
const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch admin data from the database
        const admin = await AdminModel.findOne({ email });

        // Check if the admin exists
        if (!admin || !admin.role || admin.email !== email) {
            return res.status(404).json({
                message: "Email ID Doesn't Exist",
                status: 404,
            });
        }

        // Validate password
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Email or Password Not Found",
                status: 400,
            });
        }
        let emailSubject;
        let emailContent;
        // let redirectUrl;
        let createdToken;

        if (admin.role === "Admin" || admin.role === "admin") {
            emailSubject = "Welcome Back to Blood Sync!";
            emailContent = `
                        Dear ${admin.firstname},
        
                        We're thrilled to have you back Admin! Your dedication to managing and organizing blood donation efforts is truly inspiring and helps save countless lives.
        
                        If there's anything you need assistance with or updates you'd like to share, feel free to reach out. Together, we're making a difference!
        
                        Thank you for your continued support and leadership.
        
                        Best regards,  
                        The Blood Sync Team
                    `;
            redirectUrl = "/adminlandingpage";

            // Generate JWT token
            const createdToken = jwt.sign(
                {
                    email: admin.email,
                    id: admin._id,
                    role: admin.role,
                },
                "Galu_0106", // Secret key
                { expiresIn: "1h" }
            );

            // Save login information to Super Admin model

            await superAdminLoginModel.findOneAndUpdate(
                { email: admin.email }, // Find by email
                {
                    email: admin.email,
                    password: admin.password, // Ensure this is hashed
                    token: createdToken,
                    role: admin.role,
                },
                { upsert: true, new: true } // Create new if it doesn't exist and return the updated document
            );
            // Send email notification
            await mailer.sendMail(admin.email, emailSubject, emailContent);
            // Respond to Super Admin
            return res.status(200).json({
                success: true,
                message: "Super Admin Login Successful",
                token: createdToken,
                super_admin: admin,
            });
        }
        else {
            return res.status(400).json({
                message: "You are not authorized to login",
                status: 400,
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: "Failed to add admin",
            error: error.message
        })
    }
}
const deleteAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(400).json({ message: "Please Enter Email ID & Password." })
        }

        const findAdmin = await AdminModel.findOneAndDelete({ email, password });
        if (findAdmin) {
            return res.status(200).json({
                message: "Admin Deleted Successfully",
                data: findAdmin
            })
        }
        else {
            return res.status(404).json({
                message: "Admin not found"
            })
        }
    } catch (error) {
        return res.status(404).json({
            message: "Failed to delete admin",
            error: error.message
        })
    }
}
const updateAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(400).json({ message: "Please Enter Email ID & Password." })
        }

        const findAdmin = await AdminModel.findOneAndUpdate({ email, password });
        if (findAdmin) {
            return res.status(200).json({
                message: "Admin Updated Successfully",
                data: findAdmin
            }, {
                new: true
            })
        }
        else {
            return res.status(404).json({
                message: "Admin not found"
            })
        }
    } catch (error) {
        return res.status(404).json({
            message: "Failed to update admin",
            error: error.message
        })
    }
}
module.exports = {
    addRegion,
    AddAdmin,
    deleteAdmin,
    updateAdmin,
    AdminLogin
}