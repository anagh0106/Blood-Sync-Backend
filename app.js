const express = require("express")
const dbConnection = require("./Util/DBConnection")
const PORT = 3000;
const app = express();

dbConnection.dbConnection();

app.use(express.json());
// Router
const signup = require("./Router/SignUpRouter");
const login = require("./Router/LoginRouter")
// Use
app.use("/signup", signup);
app.use("/login", login);

app.listen(PORT, (req, res) => {
    console.log(`Server Is Running On http://localhost:${PORT}`)
}) 