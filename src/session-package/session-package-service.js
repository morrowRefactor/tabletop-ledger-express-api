const SessionPackageService = {
    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('session_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
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
    updateUserStandings(knex, id, newUserStandingsFields) {
        return knex('user_standings')
            .where({ id })
            .update(newUserStandingsFields)
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
    updateUserGameCatLog(knex, id, newUserGameCatLogFields) {
        return knex('user_game_cat_logs')
            .where({ id })
            .update(newUserGameCatLogFields)
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
    updateUserGameMechLog(knex, id, newUserGameMechLogFields) {
        return knex('user_game_mech_logs')
            .where({ id })
            .update(newUserGameMechLogFields)
    },
    insertCatUserBadge(knex, newUserBadgeCat) {
        return knex
            .insert(newUserBadgeCat)
            .into('user_badges_cat')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateCatUserBadge(knex, id, newUserBadgeCatFields) {
        return knex('user_badges_cat')
            .where({ id })
            .update(newUserBadgeCatFields)
    },
    insertMechUserBadge(knex, newUserBadgeMech) {
        return knex
            .insert(newUserBadgeMech)
            .into('user_badges_mech')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateMechUserBadge(knex, id, newUserBadgeMechFields) {
        return knex('user_badges_mech')
            .where({ id })
            .update(newUserBadgeMechFields)
    }
};

module.exports = SessionPackageService;