
exports.up = function(knex) {
    return knex.schema.createTable("locations", table => {
        table.increments("LID")
        table.string("name")
        table.integer("capacity")
        table.integer("tcap")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("locations")
};
