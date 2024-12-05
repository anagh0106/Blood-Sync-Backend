const mongooes = require("mongoose") // use to invoke MongoDB Library

const uri = "mongodb://localhost:27017/bloodsync" // URI Of DB To Communicate

const dbConnection = async (req, res) => {
    try {

        const connection = await mongooes.connect(uri);
        console.log("DataBase Connection Established Successfull!");

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    dbConnection,
}