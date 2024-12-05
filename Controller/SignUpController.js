const signupModel = require("../Model/SignupModel")
const encrypt = require("../Util/Encrypt")
const loginmodel = require("../Model/LoginModel")

const SignUpUser = async (req, res) => {
    const hashedPassword = encrypt.encryptPassowrd(req.body.password);
    const UserObject = Object.assign(req.body, {
        password: hashedPassword
    })
    const saveUser = await signupModel.create(UserObject);
    if (saveUser) {
        res.status(200).json({
            message: "User created successfully",
            UserInfo: saveUser
        },) 
        const createdUser = await loginmodel.create(
            { email: saveUser.email, password: saveUser.password }
        )
        console.log(createdUser)
    }
    else {
        res.status(400).json({
            message: "Failed to create user"
        })
    }

}


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