//Urladung für tabelle "users"
exports.seed = function(knex) {
  //Alle bisherigen Einträge löschen
  return knex('users').del()
    .then(function () {
      //Urladung einfügen
      return knex('users').insert([
        {
          name: "Admin",
          password: "$2b$10$Il/Hs5R8b4lbThZEQBp6QebzMohlRsPbdFokLDxX.wEQOyUJUTGCC",
          role: "admin"
        },
        {
          name: "Gate",
          password: "$2b$10$Il/Hs5R8b4lbThZEQBp6QebzMohlRsPbdFokLDxX.wEQOyUJUTGCC",
          role: "gate"
        }
      ]);
    });
};
