const express = require("express")
const http = require("http")

const config = require("./config")
const stream = require("./stream")
const logger = require("./logger")

const app = express()
const port = 888
const server = http.createServer(app)

const socketio = require("socket.io")
const io = socketio(server)

app.use(express.json({limit: '50mb'}))
app.use(express.static("../client"))
app.use(logger)

app.put("/setConfig", (req, res) => {
    try {
        config.set(req.body)
        stream.restart()
        res.json({status: true})
    }
    catch {
        res.json({status: false})
    }
})

app.get("/getConfig", (req, res) => {
    res.json(config.get())
})

io.on('connection', client => {
    console.log("[Socket.io] New Client connected: " + client.handshake.headers["user-agent"]);
});

server.listen(port, () => {
    console.clear()
    console.log(`Server online on Port ${port}`)
    stream.init(io)
})