const SessionsService = {
    getAllSessions(knex) {
        return knex.select('*').from('sessions')
    },
    insertSession(knex, newSession) {
        return knex
            .insert(newSession)
            .into('sessions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('sessions').select('*').where('id', id).first()
    },
    deleteSession(knex, id) {
        return knex('sessions')
            .where({ id })
            .delete()
    },
    updateSession(knex, id, newSessionFields) {
        return knex('sessions')
            .where({ id })
            .update(newSessionFields)
    },
    getUserSessions(knex, uid) {
        return knex.from('sessions').select('*').where('uid', uid)
    },
    getSessionsByGame(knex) {
        return knex.from('sessions').select('game_id').count('game_id as cnt').groupBy('game_id').orderBy('cnt', 'desc')
    },
};

module.exports = SessionsService;