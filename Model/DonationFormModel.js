const mongooes = require("mongoose")
const schema = mongooes.Schema;

const BloodDonationForm = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
})

module.exports = mongooes.model("DonerForm", BloodDonationForm)