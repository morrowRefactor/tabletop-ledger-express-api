const UserStandingsService = {
    getAllUserStandings(knex) {
        return knex.select('*').from('user_standings')
    },
    insertUserStandings(knex, newUserStandings) {
        return knex
            .insert(newUserStandings)
            .into('user_standings')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('user_standings').select('*').where('id', id).first()
    },
    deleteUserStandings(knex, id) {
        return knex('user_standings')
            .where({ id })
            .delete()
    },
    updateUserStandings(knex, id, newUserStandingsFields) {
        (console.log('userstans', id, { id }, newUserStandingsFields))
        return knex('user_standings')
            .where({ id })
            .update(newUserStandingsFields)
    },
};

module.exports = UserStandingsService;