const mongoose = require("mongoose")
const schema = mongoose.Schema;
// The rights of admin
const RegionModel = new schema({
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Regions", RegionModel)