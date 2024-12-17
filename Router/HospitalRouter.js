const express = require("express")
const HospitalController = require("../Controller/HospitalController")
const router = express.Router();

router.post("/add", HospitalController.AddHospital)
router.delete("/delete", HospitalController.deleteHospital);
router.put("/update", HospitalController.update)

module.exports = router