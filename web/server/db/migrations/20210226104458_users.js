//Path: web/server/db/migrations/20210226104458_users.js
//Autor: Liam Benedetti
//Description: Knex migration

exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
      table.increments("UID")
      table.string("name")
      table.string("password")
      table.enum("role", ["gate", "admin"])
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users")
};