const UserGamesByCatLogsService = {
    getAllUserGameCatLogs(knex) {
        return knex.select('*').from('user_game_cat_logs')
    },
    insertUserGameCatLog(knex, newUserGameCatLog) {
        return knex
            .insert(newUserGameCatLog)
            .into('user_game_cat_logs')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('user_game_cat_logs').select('*').where('id', id).first()
    },
    deleteUserGameCatLog(knex, id) {
        return knex('user_game_cat_logs')
            .where({ id })
            .delete()
    },
    updateUserGameCatLog(knex, id, newUserGameCatLogFields) {
        return knex('user_game_cat_logs')
            .where({ id })
            .update(newUserGameCatLogFields)
    },
};

module.exports = UserGamesByCatLogsService;