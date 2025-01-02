const H_EventController = require("../Controller/HospitalEventController")
const express = require("express")
const router = express.Router();

router.post("/add", H_EventController.addEvent);

module.exports = router
