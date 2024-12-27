const signupModel = require("../Model/SignupModel")
const bcrypt = require("bcrypt")
const mailer = require("../Util/MailUtil")
const LoginModel = require("../Model/LoginModel");
const otpmail = require("../Util/OTPMail")
const otpSchema = require("../Model/OTPSchema")
const encrypt = require("../Util/Encrypt")
// const session = require("express-session");

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
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the email exists in LoginModel
        const emailRecord = await LoginModel.findOne({ email: userEmail });
        console.log("Email Record:", emailRecord); // Debug
        if (!emailRecord) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate OTP
        const myotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        console.log("Generated OTP:", myotp); // Debug

        // Save OTP in the database
        await otpSchema.create({ email: userEmail, otp: myotp, createdAt: Date.now() });

        // Retrieve user details from signupModel
        const user = await signupModel.findOne({ email: userEmail });
        console.log("User Record:", user); // Debug
        if (!user) {
            return res.status(404).json({ message: "User not found in signup records" });
        }

        // Send OTP email
        try {
            await otpmail.sendMail(
                userEmail,
                "OTP to Create a New Password",
                `Hello ${user.firstname}, Your One-Time Password (OTP) for BloodSync is: ${myotp}.`
            );
            console.log("OTP email sent successfully");
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            throw new Error("Failed to send OTP email");
        }

        res.status(200).json({
            message: "OTP Sent Successfully!!",
            redirectUrl: "/Otppage",
        });
    } catch (err) {
        console.error("Error in SendOTPToMail:", err);
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        // Log received data for debugging
        console.log("Request OTP:", otp);

        // Validate input
        if (!otp) {
            return res.status(400).json({ message: "OTP is required." });
        }

        // Fetch stored OTP from database (case-insensitive email match)
        const storedOtp = await otpSchema.findOne({ email: new RegExp(`^${email}$`, "i") });

        // Check if OTP entry exists for the provided email
        if (!storedOtp) {
            return res.status(404).json({ message: "OTP not found for this email." });
        }

        console.log("Stored OTP from DB:", storedOtp);

        // Compare OTPs
        if (otp.trim() !== storedOtp.otp.toString().trim()) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        // If OTP matches, return success
        res.status(200).json({ message: "OTP verified successfully." });
    } catch (err) {
        console.error("Error in VerifyOTP:", err);
        res.status(500).json({
            message: "Error in verifying OTP.",
            error: err.message,
        });
    }
};


const updatePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        // Validate input
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Hash the new password
        const hashedPassword = encrypt.encryptPassowrd(password);

        // Update user's password
        const updatedUser = await LoginModel.findOneAndUpdate(
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Failed to update password." });
        }

        // Delete OTP after successful password update
        await otpSchema.deleteOne({ email });

        // Return success message
        res.status(200).json({
            message: "Password updated successfully.",
            redirectUrl: "/login",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in updating password.",
            error: err.message,
        });
    }
};

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
    logout,
    updatePassword,
}
