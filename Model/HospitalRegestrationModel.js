const mongoose = require("mongoose")
const schema = mongoose.Schema;

const HospitalModel = new schema({
    Country: {
        type: String,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true
    },
    taluka: {
        type: String,
        required: true
    },
    hname: {
        type: String,
        required: true,
    },
    htype: {
        type: String,
        required: true,
    },
    haddress: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Hospital", HospitalModel)