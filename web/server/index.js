//imports from NPM
const express = require("express")
const http = require("http")
const cors = require("cors")

//importing routes
const traffic = require("./api/traffic")
const auth = require("./api/auth")
const video = require("./api/video")

//initiating express, http
const port = 80
const app = express()
const server = http.createServer(app)

//constant vars
const API_KEY = "ihaidhsadh98audadubsaidhi324921394u12343"

//setting middleware
app.use(cors())
app.use(express.json())
app.use(express.static("../client"))

//initiating socketio
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

//setting up the socket.io authentication
io.use((socket, next) => {
    if (socket.handshake.query.key == API_KEY) {
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
app.use("/api/traffic", traffic)
app.use("/api/auth", auth)
app.use("/api/video", video)

server.listen(port, () => {
    console.clear()
    console.log(`Server listening on port ${port}`);
})
