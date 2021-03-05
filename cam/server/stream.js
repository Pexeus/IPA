// Pfad: /cam/server/stream.js
// Autor: Liam Benedetti
// Beschreibung: Hostet den Python Subprozess

//import sub process
const spawn = require("child_process").spawn;
//this allows nodejs to kill processes by PID
const kill  = require('tree-kill');

//import the config
const config = require("./config")
//set the global variable for the python process
STREAMER = undefined

//set the global variable for socket.io
io = null

module.exports = {
    //initates the streamer with a websocket to broadcast the logs
    init: (socket) => {
        io = socket
        init()
    },
    restart: () => {
        //on restart call, kill the streamer by its PID
        //there is no init() needed, because the streamer automatically restart itself on a crash
        if (STREAMER != undefined) {
            kill(STREAMER.pid)
        }
    }
}

//initiates the streamer subprocess
function init() {
    STREAMER = spawn("python", ["-u", "../stream/streamer.py", "--server", config.get().server])
    
    STREAMER.stdout.on('data', (data) => {
        remoteLog("log", String(data));
    });

    STREAMER.stderr.on('data', (data) => {
        remoteLog("error", String(data));
    });

    STREAMER.stderr.on('close', () => {
        remoteLog("exit", "streamer closed");
        remoteLog("exit", "restarting in 2 seconds");
        setTimeout(() => {
            init()
        }, 2000);
    });
}

function remoteLog(type, message) {
    io.sockets.emit("logs", {type: type, message: message})
    //console.log(`${type}: ${message}`);
}