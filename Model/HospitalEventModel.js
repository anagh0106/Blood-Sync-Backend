const mongoose = require("mongoose")
const schema = mongoose.Schema;
const HospitalEvent = new schema({
    eventid: {
        type: String,
        unique: true, // Ensures the eventid is unique
    },
    eventname: {
        type: String,
        required: true,
    },
    eventdate: {
        type: String,
        required: true,
    },
    eventtime: {
        type: String,
        required: true,
    },
    eventlocation: {
        type: String,
        ref: "Hospital",
        required: true,
    },
    eventdescription: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("HospitalEvent", HospitalEvent)