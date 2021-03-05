//console clear
console.clear()

//imports from NPM
const express = require("express")
const http = require("http")
const cors = require("cors")

//importing routes
const traffic = require("./api/traffic")
const auth = require("./api/auth")
const video = require("./api/video")
const locations = require("./api/locations")

//importing middleware
const guard = require("./middleware/auth")

//initiating express, http
const port = 86
const app = express()
const server = http.createServer(app)

//constant vars
const config = require("./config.json")

//setting middleware

//if we are running in dev mode, use CORS
if (config.environment == "dev") {
    app.use(cors())
}

app.use(express.json())
app.use(express.static("../client-dev/dist"))

//initiating socketio
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
})

//setting up the socket.io authentication
io.use((socket, next) => {
    if (socket.handshake.query.key == config.key) {
        next()
    }
})
.on('connect', function(){
    console.log("[socket.io] new client connected!");
})

//making sockets available in external files (routes)
app.use((req, res, next) => {
    req.io = io;
    next();
})

//setting routes
app.use("/api/traffic", guard, traffic)
app.use("/api/auth", auth)
app.use("/api/video", guard, video)
app.use("/api/locations", guard, locations)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
