const config = require("../config.json")
var connection = {}

if (config.environment == "dev") {
    connection = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ipa'
    }
}
if (config.environment == "staging") {
    connection = {
        host: 'localhost',
        user: 'root',
        password: 'sml12345',
        database: 'pcounter'
    }
}

const knex = {
    client: 'mysql',
    connection: connection
}
  
module.exports = knex
