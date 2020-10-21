const MechBadgesService = {
    getAllMechBadges(knex) {
        return knex.select('*').from('badges_mech')
    },
    insertMechBadge(knex, newMechBadge) {
        return knex
            .insert(newMechBadge)
            .into('badges_mech')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('badges_mech').select('*').where('id', id).first()
    },
    deleteMechBadge(knex, id) {
        return knex('badges_mech')
            .where({ id })
            .delete()
    },
    updateMechBadge(knex, id, newMechBadgeFields) {
        return knex('badges_mech')
            .where({ id })
            .update(newMechBadgeFields)
    },
};

module.exports = MechBadgesService;