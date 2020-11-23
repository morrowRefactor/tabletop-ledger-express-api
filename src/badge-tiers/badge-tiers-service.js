const BadgeTiersService = {
    getAllBadgeTiers(knex) {
        return knex.select('*').from('badge_tiers')
    },
    insertBadgeTier(knex, newBadgeTier) {
        return knex
            .insert(newBadgeTier)
            .into('badge_tiers')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('badge_tiers').select('*').where('id', id).first()
    },
    deleteBadgeTier(knex, id) {
        return knex('badge_tiers')
            .where({ id })
            .delete()
    },
    updateBadgeTier(knex, id, newBadgeTierFields) {
        return knex('badge_tiers')
            .where({ id })
            .update(newBadgeTierFields)
    },
};

module.exports = BadgeTiersService;