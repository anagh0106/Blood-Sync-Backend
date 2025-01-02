const mongoose = require('mongoose');
const { Schema } = mongoose;

const SuperAdminLoginSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('SuperAdminLogin', SuperAdminLoginSchema);