const signupModel = require("../Model/UserSignupModel")
const encrypt = require("../Util/Encrypt")
const loginmodel = require("../Model/UserLoginModel")

let users = []
const AddUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const alluser = await signupModel.find({ email })
        // Check if the email already exists in the signup table
        const existingUser = await signupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email.",
            });
        }

        // Encrypt the password
        const hashedPassword = encrypt.encryptPassowrd(password); // Fixed typo

        // Create user object for the signup table
        const UserObject = { ...req.body, password: hashedPassword };

        // Save user to the signup table
        const saveUser = await signupModel.create(UserObject);
        // if (saveUser.role === "Super Admin" || saveUser.role === "Admin") {
        //     // await
        // }
        if (saveUser) {
            // Add the user to the login table
            // await loginmodel.create({
            //     email: saveUser.email,
            //     password: saveUser.password,
            //     role: saveUser.role,
            // });

            // Send a JSON response with a redirect URL
            // users.push(alluser)
            return res.status(201).json({
                message: "User created successfully",
                userData: saveUser,
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
const UpdateDetails = async (req, res) => {
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
const deleteUser = async (req, res) => {
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
const getuserCount = async (req, res) => {
    try {
        // Get the live count of users from the database
        const userCount = await signupModel.countDocuments();

        // Log the count (optional)
        console.log(`Total users: ${userCount}`);

        // Send the count as a response
        res.status(200).json({ count: userCount });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user count:', error);
        res.status(500).json({ message: 'Error fetching user count', error });
    }
};

module.exports = {
    AddUser,
    getAllUser,
    UpdateDetails,
    deleteUser,
    getuserCount,
}