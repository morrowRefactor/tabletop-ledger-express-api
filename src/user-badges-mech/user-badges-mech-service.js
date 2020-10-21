const UserBadgesMechService = {
    getAllMechUserBadges(knex) {
        return knex.select('*').from('user_badges_mech')
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
    getById(knex, id) {
       return knex.from('user_badges_mech').select('*').where('id', id).first()
    },
    deleteMechUserBadge(knex, id) {
        return knex('user_badges_mech')
            .where({ id })
            .delete()
    },
    updateMechUserBadge(knex, id, newUserBadgeMechFields) {
        return knex('user_badges_mech')
            .where({ id })
            .update(newUserBadgeMechFields)
    },
};

module.exports = UserBadgesMechService;