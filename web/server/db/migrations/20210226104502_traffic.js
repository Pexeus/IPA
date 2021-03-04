exports.up = function(knex) {
    return knex.schema.createTable("traffic", table => {
        table.increments("TID")
        table.integer("LID")
        // hier können in der Zukunft weitere events registriert werden
        table.enum("event", ["enter", "exit"])
        table.integer("time")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("traffic")
};
