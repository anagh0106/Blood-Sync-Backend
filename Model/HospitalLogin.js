const mongoose = require("mongoose")
const schema = mongoose.Schema;

const HospitalLogin = new schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("RegisteredHospital", HospitalLogin)
