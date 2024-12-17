const HospitalModel = require("../Model/HospitalRegestrationModel");
const HospitalLogin = require("../Model/HospitalLogin");
const encrypt = require("../Util/Encrypt");
const bcrypt = require("bcrypt")

const AddHospital = async (req, res) => {
    try {
        const { hname, district, taluka, id, password } = req.body;

        // Input validation
        if (!hname || !district || !taluka || !id || !password) {
            return res.status(400).json({
                message: "Please Fill All Details",
            });
        }

        // Encrypt password
        const hashedPassword = encrypt.encryptPassowrd(password);

        // Combine req.body with hashed password
        const Hospital = { ...req.body, password: hashedPassword };

        // Create hospital in database
        const CreatedHospital = await HospitalModel.create(Hospital);

        if (CreatedHospital) {
            // Create login entry for hospital
            await HospitalLogin.create({
                id: CreatedHospital.id,
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

}

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

}

module.exports = {
    AddHospital,
    deleteHospital,
    update,
};
