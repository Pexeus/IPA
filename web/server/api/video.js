//Path: web/server/api/locations.js
//Autor: Liam Benedetti
//Description: All express routes related to video data

const express = require("express")
const db = require("../db/connection")

const router = express.Router()

//status
router.get("/", (req, res) => {
    res.end("video service online")
})

//take a base64 encoded frame and emit it over a websocket
router.post("/", (req, res) => {
    const data = req.body
    req.io.sockets.emit(`video_${data.cam}`, data.data)
    res.end("ok")
})

module.exports = router
