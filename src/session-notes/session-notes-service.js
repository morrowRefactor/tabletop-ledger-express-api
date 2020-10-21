const SessionNotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('session_notes')
    },
    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('session_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('session_notes').select('*').where('id', id).first()
    },
    deleteNote(knex, id) {
        return knex('session_notes')
            .where({ id })
            .delete()
    },
    updateNote(knex, id, newNoteFields) {
        return knex('session_notes')
            .where({ id })
            .update(newNoteFields)
    },
};

module.exports = SessionNotesService;