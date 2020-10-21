const GameTipsService = {
    getAllGameTips(knex) {
        return knex.select('*').from('game_tips')
    },
    insertGameTip(knex, newGameTip) {
        return knex
            .insert(newGameTip)
            .into('game_tips')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('game_tips').select('*').where('id', id).first()
    },
    deleteGameTip(knex, id) {
        return knex('game_tips')
            .where({ id })
            .delete()
    },
    updateGameTip(knex, id, newGameTipFields) {
        return knex('game_tips')
            .where({ id })
            .update(newGameTipFields)
    },
};

module.exports = GameTipsService;