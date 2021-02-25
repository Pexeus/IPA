const spawn = require("child_process").spawn;
const kill  = require('tree-kill');

const config = require("./config")
STREAMER = undefined

io = null

module.exports = {
    init: (socket) => {
        io = socket
        init()
    },
    restart: () => {
        if (STREAMER != undefined) {
            kill(STREAMER.pid)
        }
    }
}

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