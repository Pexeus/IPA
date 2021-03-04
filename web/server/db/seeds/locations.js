//Urladung für tabelle "locations"
exports.seed = function(knex) {
  //Alle bisherigen Einträge löschen
  return knex('locations').del()
    .then(() => {
      //Urladung einfügen
      return knex('locations').insert([
        {
          name: "raspberrypi",
          capacity: "10",
          tcap: 0
        },
      ]);
    });
};
