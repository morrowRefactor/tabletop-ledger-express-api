const UserBadgesCatService = {
    getAllCatUserBadges(knex) {
        return knex.select('*').from('user_badges_cat')
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
    getById(knex, id) {
       return knex.from('user_badges_cat').select('*').where('id', id).first()
    },
    deleteCatUserBadge(knex, id) {
        return knex('user_badges_cat')
            .where({ id })
            .delete()
    },
    updateCatUserBadge(knex, id, newUserBadgeCatFields) {
        return knex('user_badges_cat')
            .where({ id })
            .update(newUserBadgeCatFields)
    },
};

module.exports = UserBadgesCatService;