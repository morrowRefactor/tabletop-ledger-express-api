const CatBadgesService = {
    getAllCatBadges(knex) {
        return knex.select('*').from('badges_cat')
    },
    insertCatBadge(knex, newCatBadge) {
        return knex
            .insert(newCatBadge)
            .into('badges_cat')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('badges_cat').select('*').where('id', id).first()
    },
    deleteCatBadge(knex, id) {
        return knex('badges_cat')
            .where({ id })
            .delete()
    },
    updateCatBadge(knex, id, newCatBadgeFields) {
        return knex('badges_cat')
            .where({ id })
            .update(newCatBadgeFields)
    },
};

module.exports = CatBadgesService;