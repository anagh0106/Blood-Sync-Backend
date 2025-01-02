const express = require("express")
const dbConnection = require("./Util/DBConnection")
const PORT = 3000;
const app = express();
const cors = require("cors") // Cross-Origin Resource Sharing


dbConnection.dbConnection();

// app.use(cookieParser());
app.use(express.json());
app.use(cors())

// Router
const signup = require("./Router/SignUpRouter");
const login = require("./Router/LoginRouter");
const porfile = require("./Router/ProfileRouter")
const hospital = require("./Router/HospitalRouter")
const donation = require("./Router/RegistrationRouter")
const region = require("./Router/RegionRouter")
const h_event = require("./Router/HospitalEventRouter")
const SuperAdmin = require("./Router/SuperAdminRouter")
// Use
app.use("/signup", signup);
app.use("/login", login);
app.use("/profile", porfile);
app.use("/hospital", hospital);
app.use("/registration", donation);
app.use("/region", region);
app.use("/event", h_event);
app.use("/admin", SuperAdmin);
app.listen(PORT, (req, res) => {
    console.log(`Server Is Running On http://localhost:${PORT}`)
})
