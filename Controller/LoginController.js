const signupModel = require("../Model/SignupModel")
const bcrypt = require("bcrypt")
const mailer = require("../Util/MailUtil")
const LoginModel = require("../Model/LoginModel");
const otpmail = require("../Util/OTPMail")
const otpSchema = require("../Model/OTPSchema")
const encrypt = require("../Util/Encrypt")
const session = require("express-session");

const loginUser = async (req, res) => {
    console.log(req.body);
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await signupModel.findOne({ email: email });
        console.log(email, password);

        const CreatedUser = await LoginModel.findOne({ email: email });

        if (CreatedUser) {
            if (user.email != CreatedUser.email) {
                res.status(202).json({
                    message: "Email ID Doesn't Exist",
                    status: 202
                });
            } else {
                if (user) {
                    const isPasswordMatch = await bcrypt.compare(password, user.password);

                    if (isPasswordMatch) {
                        await mailer.sendMail(
                            user.email,
                            "Greeting Mail To New User",
                            `Welcome ${user.firstname} ,
                             You Have Successfully Logged In Our System.!
                             Your Login Details are Email => ${req.body.email} Password => ${req.body.password}
                             Thank You For Choosing Us!`
                        );

                        res.status(200).json({
                            message: "You Have Logged In Successfully",
                            UserInfo: {
                                email: user.email,
                                name: user.name,
                            },
                            redirectUrl: "/landingpage",
                        });

                    } else {
                        res.status(400).json({
                            message: "Email or Password Not Found",
                            UserInfo: [],
                        });
                    }
                }
            }
        } else {
            res.status(400).json({
                message: "You Have Not Signed Up Yet!!",
                UserInfo: [],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Something Went Wrong!!",
            UserInfo: [],
        });
    }
};

const SendOTPToMail = async (req, res) => {
    try {
        const userEmail = req.body.email; // Retrieve email from request body
        if (!userEmail) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        // Check if the email exists in LoginModel
        const emailRecord = await LoginModel.findOne({ email: userEmail });
        if (!emailRecord) {
            return res.status(404).json({
                message: "Email not found",
            });
        }

        // Generate OTP
        const myotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        // Save OTP in the database
        await otpSchema.create({ email: userEmail, otp: myotp, createdAt: Date.now() });

        // Retrieve user details from signupModel
        const user = await signupModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found in signup records",
            });
        }

        // Send OTP email
        await otpmail.sendMail(
            userEmail,
            "OTP to Create a New Password",
            `Hello ${user.firstname},Your One-Time Password (OTP) for BloodSync is: ${myotp}. This code is valid for the next 2 minutes.`
        );

        res.status(200).json({
            message: "OTP Sent Successfully!!",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    // const newpassword = req.body;
    try {
        const { email, otp, password, confirmPassword } = req.body
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ message: "Please provide both email and OTP" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Fetch stored OTP securely (Example: assuming otpSchema has an OTP for this email)
        const storedOtp = await otpSchema.findOne({ email })
        if (!storedOtp) {
            return res.status(404).json({ message: "OTP not found for this email" });
        }
        // Log for debugging
        console.log(`Provided OTP: ${otp}, Stored OTP: ${storedOtp.otp}`);

        // Compare OTPs securely
        if (otp.trim() !== storedOtp.otp.toString().trim()) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        if (password != confirmPassword) {
            return res.status(401).json({
                message: "Passwords do not match",
            })
        }
        //  Hash The New Password
        const hashedPassword = encrypt.encryptPassowrd(password)

        // Updated User Password
        const updatedUser = await LoginModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true },
        )

        if (!updatedUser) {
            return res.status(400).json({ message: "Failed to update password" });
        }

        // Return Success Message
        res.status(200).json({
            message: "Password updated successfully",
            data: { email: updatedUser.email, password: updatedUser.password },
            redirectUrl: "/login",
        });

        await otpSchema.deleteOne({ email });

    }
    catch (err) {
        res.status(500).json({
            message: "Error in updating password",
            error: err.message
        });
    }
}

const showPassword = async (req, res) => {
    try {
        const email = req.body.email;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                data: {}
            });
        }

        // Find user by email
        const userdata = await LoginModel.findOne({ email: email });

        // Check if userdata exists
        if (!userdata) {
            return res.status(404).json({
                message: "User not found",
                data: {}
            });
        }
        // Decrypt the hashed password
        const realPassword = encrypt.decryptPassword(req.body.password, userdata.password)

        // Respond with the decrypted password
        res.status(200).json({
            message: "Password retrieved successfully",
            data: {
                email: userdata.email,
                password: realPassword
            }
        });

    } catch (err) {
        console.error("Error in showPassword:", err);
        res.status(500).json({
            message: "An error occurred",
            error: err.message
        });
    }
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed. Please try again.' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        return res.status(200).json({ message: 'Logged out successfully!' });
    });
};


module.exports = {
    loginUser,
    SendOTPToMail,
    verifyOTP,
    showPassword,
    logout
}
