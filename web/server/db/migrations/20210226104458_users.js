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