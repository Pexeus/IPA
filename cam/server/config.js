const fs = require("fs")
const configFile = "../config.json"

module.exports = {
    get: () => {
        return JSON.parse(fs.readFileSync(configFile))
    },
    set: (config) => {
        fs.writeFileSync(configFile, JSON.stringify(config))
    }
}