const MechGamesService = {
    getAllMechGames(knex) {
        return knex.select('*').from('games_mech')
    },
    insertMechGame(knex, newMechGame) {
        return knex
            .insert(newMechGame)
            .into('games_mech')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('games_mech').select('*').where('id', id).first()
    },
    deleteMechGame(knex, id) {
        return knex('games_mech')
            .where({ id })
            .delete()
    },
    updateMechGame(knex, id, newMechGameFields) {
        return knex('games_mech')
            .where({ id })
            .update(newMechGameFields)
    },
};

module.exports = MechGamesService;