const express = require("express")
const HospitalController = require("../Controller/HospitalController")
const router = express.Router();

router.post("/add", HospitalController.AddHospital)
router.delete("/delete", HospitalController.deleteHospital);
router.put("/update", HospitalController.update)
router.get("/get", HospitalController.getAllHospital)
router.get("/count", HospitalController.getHospitalCount)

module.exports = router