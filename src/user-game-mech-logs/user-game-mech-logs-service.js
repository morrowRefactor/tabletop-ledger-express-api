const UserGamesByMechLogsService = {
    getAllUserGameMechLogs(knex) {
        return knex.select('*').from('user_game_mech_logs')
    },
    insertUserGameMechLog(knex, newUserGameMechLog) {
        return knex
            .insert(newUserGameMechLog)
            .into('user_game_mech_logs')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('user_game_mech_logs').select('*').where('id', id).first()
    },
    deleteUserGameMechLog(knex, id) {
        return knex('user_game_mech_logs')
            .where({ id })
            .delete()
    },
    updateUserGameMechLog(knex, id, newUserGameMechLogFields) {
        return knex('user_game_mech_logs')
            .where({ id })
            .update(newUserGameMechLogFields)
    },
};

module.exports = UserGamesByMechLogsService;