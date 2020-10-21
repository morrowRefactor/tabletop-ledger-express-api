const UserGamesService = {
    getAllUserGames(knex) {
        return knex.select('*').from('user_games')
    },
    insertUserGame(knex, newUserGame) {
        return knex
            .insert(newUserGame)
            .into('user_games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('user_games').select('*').where('id', id).first()
    },
    deleteUserGame(knex, id) {
        return knex('user_games')
            .where({ id })
            .delete()
    },
    updateUserGame(knex, id, newUserGameFields) {
        return knex('user_games')
            .where({ id })
            .update(newUserGameFields)
    },
};

module.exports = UserGamesService;