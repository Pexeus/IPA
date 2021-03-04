const connection = require("./knexfile")

const knex = require("knex")(connection)

module.exports = knex