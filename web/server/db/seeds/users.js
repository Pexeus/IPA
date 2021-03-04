//Urladung für tabelle "users"
exports.seed = function(knex) {
  //Alle bisherigen Einträge löschen
  return knex('users').del()
    .then(function () {
      //Urladung einfügen
      return knex('users').insert([
        {
          name: "Admin",
          password: "$2b$10$gSTvTr94r1Rr7iejvQa5ve6qFLMzp6D6AfwMrCDhZZx8cvBqOGfzi",
          role: "admin"
        },
        {
          name: "Gate",
          password: "$2b$10$gSTvTr94r1Rr7iejvQa5ve6qFLMzp6D6AfwMrCDhZZx8cvBqOGfzi",
          role: "gate"
        }
      ]);
    });
};
