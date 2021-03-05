//Path: web/server/db/connection.js
//Autor: Liam Benedetti
//Description: Knex connection


const connection = require("./knexfile")

const knex = require("knex")(connection)

module.exports = knex