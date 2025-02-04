const HospitalModel = require("../Model/HospitalRegestrationModel");
const HospitalLogin = require("../Model/HospitalLogin");
const encrypt = require("../Util/Encrypt");
const bcrypt = require("bcrypt")

const AddHospital = async (req, res) => {
    try {
        const hinfo = req.body;

        console.log(hinfo)
        // Input validation
        if (!hinfo) {
            return res.status(400).json({
                message: "Please Fill All Details",
            });
        }

        // Encrypt password
        const hashedPassword = encrypt.encryptPassowrd(req.body.password);

        // Combine req.body with hashed password
        const Hospital = { ...req.body, password: hashedPassword };

        // Create hospital in database
        const CreatedHospital = await HospitalModel.create(Hospital);

        if (CreatedHospital) {
            // Create login entry for hospital
            await HospitalLogin.create({
                email: CreatedHospital.email,
                password: CreatedHospital.password,
            });

            return res.status(200).json({
                message: "Hospital Registration Successful!",
                data: CreatedHospital,
            });
        }

        // Fallback error response
        return res.status(500).json({
            message: "Something Went Wrong!",
        });

    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};
const deleteHospital = async (req, res) => {
    try {

        const { id, password } = req.body
        if (!id || !password) {
            return res.status(400).json({
                message: "Hospital ID and Password are required.",
            });
        }
        const hospitalid = await HospitalModel.findOne({ id })

        if (!hospitalid) {
            return res.status(404).json({
                message: "No hospital found with the provided ID.",
            });
        }
        // use to decrypt the password
        const isPasswordValid = bcrypt.compareSync(password, hospitalid.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Password is not correct!",
            });
        }

        await HospitalModel.deleteOne({ id });
        await HospitalLogin.deleteOne({ id });

        return res.status(200).json({
            message: `Your hospital with ID ${id} has been deleted successfully.`,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Something went wrong!",
            error: err.message,
        });
    }

};
const update = async (req, res) => {
    try {
        const id = req.body.id;
        const data = req.body;
        if (!data) {
            res.status(404).json({
                message: "ID Not Found In Our System!"
            })
        }

        const updatedHospitalData = await HospitalModel.findOneAndUpdate(
            { id: id },
            data,
            { new: true }
        )

        if (updatedHospitalData) {
            res.status(200).json({
                message: "Hospital Details Updated Successfully",
                UserInfo: updatedHospitalData
            });
        } else {
            res.status(404).json({
                message: "ID Not Found In Our DataBase",
                UserInfo: []
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating user details",
            error: error.message
        });
    }

};
const getAllHospital = async (req, res) => {
    try {
        const hinfo = await HospitalModel.find();

        if (!hinfo) {
            return res.status(404).json({
                message: " Hospital Not Found! , Make Sure You Have Registered",
            });
        }
        res.status(200).json({
            message: "Hospital Found",
            data: hinfo,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while updating user details",
            error: error.message
        });
    }
};
const getHospitalCount = async (req, res) => {
    try {
        // Get the live count of users from the database
        const hcount = await HospitalModel.countDocuments();

        // Log the count (optional)
        console.log(`Total users: ${hcount}`);

        // Send the count as a response
        res.status(200).json({ count: hcount });
    } catch (error) {
        // Handle errors
        console.error('Error fetching user count:', error);
        res.status(500).json({ message: 'Error fetching user count', error });
    }
};
module.exports = {
    AddHospital,
    deleteHospital,
    update,
    getAllHospital,
    getHospitalCount,
};
