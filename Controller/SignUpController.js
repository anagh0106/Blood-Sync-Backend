const signupModel = require("../Model/SignupModel")
const encrypt = require("../Util/Encrypt")
const loginmodel = require("../Model/UserLoginModel")
const adminModel = require("../Model/AdminPanelModel")

const SignUpUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email already exists in the signup table
        const existingUser = await signupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email.",
            });
        }

        // Encrypt the password
        const hashedPassword = encrypt.encryptPassowrd(password); // Fixed typo

        // Check if the credentials are for the admin
        if (email === "anagh0106@gmail.com" && password === "Anagh_0106") {
            const AdminObject = { email, password: hashedPassword };

            // Create admin in the admin table
            const admin = await adminModel.create(AdminObject);
            return res.status(201).json({
                message: "Admin created successfully",
                adminInfo: admin,
            });
        }


        // Create user object for the signup table
        const UserObject = { ...req.body, password: hashedPassword };

        // Save user to the signup table
        const saveUser = await signupModel.create(UserObject);
        if (saveUser) {
            // Add the user to the login table
            await loginmodel.create({
                email: saveUser.email,
                password: saveUser.password,
            });

            // Send a JSON response with a redirect URL
            return res.status(201).json({
                message: "User created successfully",
                redirectUrl: "/signin", // Provide this for frontend redirection
            });
        } else {
            return res.status(400).json({
                message: "Failed to create user",
            });
        }
    } catch (error) {
        console.error("Error during signup:", error);

        // Handle generic errors
        return res.status(500).json({
            message: "An error occurred during signup. Please try again later.",
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const users = await signupModel.find()
        if (users) {
            res.status(200).json({
                message: "All Users Fetched Successfully",
                UserInfo: users
            })
        }
        else {
            res.status(404).json({
                message: "No Users Found"
            })
        }
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong to Fetch All Users",
            UserInfo: []
        })
    }
}

const UpdateDetailsByEmail = async (req, res) => {
    try {
        const email = req.body.email; // Get email from the route parameter
        const userdata = req.body; // Get user data from the request body

        if (email) {
            // Update the user details based on the email
            const updatedUser = await signupModel.findOneAndUpdate(
                { email: email }, // Query object
                userdata, // Data to update
                { new: true } // Return the updated document
            );

            if (updatedUser) {
                res.status(200).json({
                    message: "User Details Updated Successfully",
                    UserInfo: updatedUser
                });
            } else {
                res.status(404).json({
                    message: "Email Not Found In Our DataBase",
                    UserInfo: []
                });
            }
        } else {
            res.status(400).json({
                message: "Email is required to Update User Details",
                UserInfo: []
            });
        }
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({
            message: "An error occurred while updating user details",
            error: error.message
        });
    }
};

const deleteUserByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const userdata = req.body;

        if (email) {
            const deletedUser = await signupModel.findOneAndDelete({ email: email }, { new: true })
            if (deletedUser) {
                res.status(200).json({
                    message: "User Deleted Successfully",
                    UserInfo: deletedUser,
                })
            }
            else {
                res.status(404).json({
                    message: "E-mail not Found in our database",
                    UserInfo: []
                });
            }
        }
        else {
            res.status(400).json({
                message: "Email is required to Update User Details",
                UserInfo: []
            });
        }
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({
            message: "An error occurred while updating user details",
            error: error.message
        });
    }
}

module.exports = {
    SignUpUser,
    getAllUser,
    UpdateDetailsByEmail,
    deleteUserByEmail
}