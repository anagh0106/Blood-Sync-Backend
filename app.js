const express = require("express")
const dbConnection = require("./Util/DBConnection")
const PORT = 3000;
const app = express();
const cors = require("cors") // Cross-Origin Resource Sharing
// const session = require("express-session");
// const cookieParser = require('cookie-parser');

dbConnection.dbConnection();

// app.use(cookieParser());
app.use(express.json());
app.use(cors())
// app.use(
//     session({
//         secret: 'Anagh', // Replace with a strong secret
//         resave: false,
//         saveUninitialized: false,
//         cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day expiration
//     })
// );
// Router
const signup = require("./Router/SignUpRouter");
const login = require("./Router/LoginRouter");
const porfile = require("./Router/ProfileRouter")
const hospital = require("./Router/HospitalRouter")
const donation = require("./Router/RegistrationRouter")
// Use
app.use("/signup", signup);
app.use("/login", login);
app.use("/profile", porfile);
app.use("/hospital", hospital);
app.use("/registration", donation)
app.listen(PORT, (req, res) => {
    console.log(`Server Is Running On http://localhost:${PORT}`)
})
