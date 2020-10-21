const UserReccosService = {
    getAllUserReccos(knex) {
        return knex.select('*').from('user_reccos')
    },
    insertUserRecco(knex, newUserRecco) {
        return knex
            .insert(newUserRecco)
            .into('user_reccos')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('user_reccos').select('*').where('id', id).first()
    },
    deleteUserRecco(knex, id) {
        return knex('user_reccos')
            .where({ id })
            .delete()
    },
    updateUserRecco(knex, id, newUserReccoFields) {
        return knex('user_reccos')
            .where({ id })
            .update(newUserReccoFields)
    },
};

module.exports = UserReccosService;