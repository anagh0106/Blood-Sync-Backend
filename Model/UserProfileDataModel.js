const mongoose = require("mongoose")
const schema = mongoose.Schema;

const ProfileSchema = new schema({
    profilename: {
        type: String,
        required: true,
    },
    dob: {
        type: String, // date
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number, // in cms
        required: true,
    },
    // populate in signupdata

})