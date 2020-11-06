const MechGamesMatchesService = {
    getAllMechGameMatches(knex) {
        return knex.select('*').from('games_mech_matches')
    },
    insertMechGameMatch(knex, newMechGameMatch) {
        return knex
            .insert(newMechGameMatch)
            .into('games_mech_matches')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('games_mech_matches').select('*').where('id', id).first()
    },
    deleteMechGameMatch(knex, id) {
        return knex('games_mech_matches')
            .where({ id })
            .delete()
    },
    updateMechGameMatch(knex, id, newMechGameMatchFields) {
        return knex('games_mech_matches')
            .where({ id })
            .update(newMechGameMatchFields)
    },
};

module.exports = MechGamesMatchesService;