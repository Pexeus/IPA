//Path: web/server/db/seeds/locations.js
//Autor: Liam Benedetti
//Description: Knex seed


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
