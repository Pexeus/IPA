//imports from NPM
const express = require("express")
const http = require("http")
const cors = require("cors")

//importing routes
const traffic = require("./api/traffic")
const auth = require("./api/auth")

//initiating express, http
const port = 80
const app = express()
const server = http.createServer(app)

//setting middleware
app.use(cors())
app.use(express.json())
app.use(express.static("../client"))

//making sockets available in external files
app.use((req, res, next) => {
    req.io = io;
    next();
})

//setting routes
app.use("/api/traffic", traffic)
app.use("/api/auth", auth)

//initiating socketio
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

//establishing socket.io connections
io.on('connection', client => {
    console.log("new socket client connected");
});

server.listen(port, () => {
    console.clear()
    console.log(`Server listening on port ${port}`);
})
