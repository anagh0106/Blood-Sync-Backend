const mongoose = require("mongoose")
const schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid")

const HospitalModel = new schema({
    hospitalEventId: {
        type: String,
        unique: true, // Ensures the hospital ID is unique
        default: uuidv4, // Automatically generates a UUID
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    hname: {
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