const express = require("express")
const db = require("../db/connection")

const router = express.Router()

router.get("/", (req, res) => {
    res.end("video service online")
})

router.post("/", (req, res) => {
    const data = req.body
    req.io.sockets.emit(`video_${data.cam}`, data.data)
    res.end("ok")
})

module.exports = router
