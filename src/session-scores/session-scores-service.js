const SessionScoresService = {
    getAllScores(knex) {
        return knex.select('*').from('session_scores')
    },
    insertScores(knex, newScores) {
        return knex
            .insert(newScores)
            .into('session_scores')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('session_scores').select('*').where('id', id).first()
    },
    deleteScores(knex, id) {
        return knex('session_scores')
            .where({ id })
            .delete()
    },
    updateScores(knex, id, newScoresFields) {
        return knex('session_scores')
            .where({ id })
            .update(newScoresFields)
    },
};

module.exports = SessionScoresService;