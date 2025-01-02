const HospitalEventModel = require("../Model/HospitalEventModel")
const HospitalModel = require("../Model/HospitalLogin")
const addEvent = async (req, res) => {
    try {
        const eventData = req.body;

        if (!eventData) {
            return res.status(400).json({ message: "Event data is required" })
        }

        // For registered Hospital
        // await HospitalModel.findOne({ email: email }, "hospitalEventId")
        //     .then((hospital) => {
        //         if (hospital) {
        //             console.log("Hospital ID ", hospital.hospitalEventId);
        //         }
        //         else {
        //             console.log("Hospital ID not found");
        //         }
        //     })

        const newEvent = await HospitalEventModel.create(eventData)

        if (!newEvent) {
            res.status(404).json({
                message: "Occur Some Error to create Event ",
            })
        }

        res.status(201).json({
            message: "Event created successfully",
            data: newEvent
        })
    } catch (err) {
        res.status(404).json({
            message: "Unable To Fetch Data Of Event!",
            error: err.message
        })
    }
}

module.exports = {
    addEvent,
}