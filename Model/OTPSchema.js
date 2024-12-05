const mongooes = require("mongoose")
const schema = mongooes.Schema

const otpSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
})

module.exports = mongooes.model("OTPSchema", otpSchema)