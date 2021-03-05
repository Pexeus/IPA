//Path: web/server/db/migrations/20210226104502_traffic.js
//Autor: Liam Benedetti
//Description: Knex migration

exports.up = function(knex) {
    return knex.schema.createTable("traffic", table => {
        table.increments("TID")
        table.integer("LID")
        // hier können in der Zukunft weitere events registriert werden
        table.enum("event", ["enter", "exit"])
        table.bigInteger("time")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("traffic")
};
