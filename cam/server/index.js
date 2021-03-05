// Pfad: /cam/server/index.js
// Autor: Liam Benedetti
// Beschreibung: Initiert den Server und importiert sämtliche Module

const express = require("express")
const http = require("http")

//import the routes
const config = require("./config")
const stream = require("./stream")
const logger = require("./logger")

//initiate express
const app = express()
//set the http port
const port = 80
//create a http server ant append express
const server = http.createServer(app)

//import socket.io and connect it to the http server
const socketio = require("socket.io")
const io = socketio(server)

//use json middleware
app.use(express.json({limit: '50mb'}))
//set the static files
app.use(express.static("../client"))
//set the logger middleware
app.use(logger)

//define the route for updating the config file
app.put("/setConfig", (req, res) => {
    try {
        //set the new config and restrt the python process to load the new config
        config.set(req.body)
        stream.restart()
        res.json({status: true})
    }
    //on error, notify the user
    catch {
        res.json({status: false})
    }
})

//set the route to recieve the current config
app.get("/getConfig", (req, res) => {
    res.json(config.get())
})

//connection route for socket.io clients
io.on('connection', client => {
    //notify on new connections
    console.log("[Socket.io] New Client connected: " + client.handshake.headers["user-agent"])
})

//make the http server listen on the specified port
server.listen(port, () => {
    console.clear()
    console.log(`Server online on Port ${port}`)
    //on a sucessfull start of the server, start the python process
    stream.init(io)
})
