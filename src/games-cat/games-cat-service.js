const CatGamesService = {
    getAllCatGames(knex) {
        return knex.select('*').from('games_cat')
    },
    insertCatGame(knex, newCatGame) {
        return knex
            .insert(newCatGame)
            .into('games_cat')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('games_cat').select('*').where('cat_id', id).first()
    },
    deleteCatGame(knex, id) {
        return knex('games_cat')
            .where({ id })
            .delete()
    },
    updateCatGame(knex, id, newCatGameFields) {
        return knex('games_cat')
            .where({ id })
            .update(newCatGameFields)
    },
};

module.exports = CatGamesService;