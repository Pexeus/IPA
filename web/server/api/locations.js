//Path: web/server/api/locations.js
//Autor: Liam Benedetti
//Description: All express routes related to location data

const express = require("express")
const db = require("../db/connection")

const router = express.Router()

//status
router.get("/", (req, res) => {
    res.end("location service online")
})

//return informations of a specific location
router.get("/info/:LID", async (req, res) => {
    const LID = req.params.LID

    const locationInfo = await db("locations")
        .where({LID: LID})
        .first()

    res.json(locationInfo)
})

//update a specific location with given data
router.post("/update", (req, res) => {
    const config = req.body
    console.log(config);

    try {
        await = db("locations")
        .where({LID: config.LID})
        .update({
            name: config.name,
            capacity: config.capacity,
            tcap: config.tcap
        })
        .catch(err => {
            console.log(err);
        })

        req.io.sockets.emit("dataupdate")

        res.json({status: true})
    }
    catch {
        res.json({
            status: false,
            message: "Konfiguration konnte nicht aktualisiert werden"
        })
    }
})

module.exports = router