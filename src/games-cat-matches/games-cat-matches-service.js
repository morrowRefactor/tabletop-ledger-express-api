const CatGamesMatchesService = {
    getAllCatGameMatches(knex) {
        return knex.select('*').from('games_cat_matches')
    },
    insertCatGameMatch(knex, newCatGameMatch) {
        return knex
            .insert(newCatGameMatch)
            .into('games_cat_matches')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('games_cat_matches').select('*').where('id', id).first()
    },
    deleteCatGameMatch(knex, id) {
        return knex('games_cat_matches')
            .where({ id })
            .delete()
    },
    updateCatGameMatch(knex, id, newCatGameMatchFields) {
        return knex('games_cat_matches')
            .where({ id })
            .update(newCatGameMatchFields)
    },
};

module.exports = CatGamesMatchesService;