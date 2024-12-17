const mongoose = require("mongoose")
const schema = mongoose.Schema;

const HospitalModel = new schema({
    hname: {
        type: String,
        required: true,
        unique: true,
    },
    district: {
        type: String,
        required: true
    },
    taluka: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Hospital", HospitalModel)