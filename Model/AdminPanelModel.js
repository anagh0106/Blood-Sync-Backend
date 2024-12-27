const mongoose = require("mongoose")
const schema = mongoose.Schema;

const AdminPanel = new schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})
module.exports = mongoose.model("AdminPanel", AdminPanel)