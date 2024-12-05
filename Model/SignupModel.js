const mongoose = require("mongoose")
const schema = mongoose.Schema;

const SignupSchema = new schema({

    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
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

module.exports = mongoose.model("Signup", SignupSchema);