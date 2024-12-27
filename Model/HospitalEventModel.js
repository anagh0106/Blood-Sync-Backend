const mongoose = require("mongoose")
const schema = mongoose.Schema;

const HospitalEvent = new schema({
    eventname: {
        type: String,
        required: true,
    },
    eventdate: {
        type: String, // date
        required: true,
    },
    eventtime: {
        type: String, // time
        required: true,
    },
    eventlocation: {
        type: schema.Types.ObjectId,
        ref: "Hospital"
    },
    eventdescription: {
        type: String,
        required: true,
    },
    eventppllimit: {
        type: Number,
    },
})

module.exports = mongoose.model("HospitalEvent", HospitalEvent)