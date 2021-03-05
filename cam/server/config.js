// Pfad: /cam/client/js/config.js
// Autor: Liam Benedetti
// Beschreibung: specihert/ladet die Konfiguration


const fs = require("fs")
//set the path to the config file
const configFile = "../config.json"

//export the functions to set/get the config
module.exports = {
    get: () => {
        return JSON.parse(fs.readFileSync(configFile))
    },
    set: (config) => {
        fs.writeFileSync(configFile, JSON.stringify(config))
    }
}