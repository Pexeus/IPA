//Path: web/server/db/migrations/20210226104507_locations.js
//Autor: Liam Benedetti
//Description: Knex migration


exports.up = function(knex) {
    return knex.schema.createTable("locations", table => {
        table.increments("LID")
        table.string("name")
        table.integer("capacity")
        table.bigInteger("tcap")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("locations")
};
