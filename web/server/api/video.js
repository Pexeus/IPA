const express = require("express")
const db = require("../db/connection")

const router = express.Router()

router.get("/", (req, res) => {
    res.end("video service online")
})

router.post("/", (req, res) => {
    req.io.sockets.emit("frame", req.body)
    console.log(frame);
    res.end("ok")
})

module.exports = router