const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeSessionNotesArray, makeMaliciousSessionNotes } = require('./session-notes.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeSessionsArray } = require('./sessions.fixtures');

describe('Session Notes Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, sessions, session_notes RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, sessions, session_notes RESTART IDENTITY CASCADE'));

  describe(`GET /api/session-notes`, () => {
    context(`Given no session notes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/session-notes')
          .expect(200, [])
      })
    });

    context('Given there are session notes in the database', () => {
      const testUsers = makeUsersArray();
      const testSessions = makeSessionsArray();
      const testSessionNotes = makeSessionNotesArray();

      beforeEach('insert session notes', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
          .then(() => {
              return db 
                .into('session_notes')
                .insert(testSessionNotes)
          })
      });

      it('responds with 200 and all of the session notes', () => {
        return supertest(app)
          .get('/api/session-notes')
          .expect(200, testSessionNotes)
        });
    });

    context(`Given an XSS attack scores`, () => {
      const testUsers = makeUsersArray();
      const testSessions = makeSessionsArray();
      const { maliciousSessionNote, expectedSessionNote } = makeMaliciousSessionNotes();

      beforeEach('insert malicious note', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
          .then(() => {
              return db
                .into('session_notes')
                .insert(maliciousSessionNote)
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/session-notes`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].note).to.eql(expectedSessionNote.note)
          })
      });
    });
  });

  describe(`GET /api/session-notes/:sess_id`, () => {
    context(`Given no session notes`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .get(`/api/session-notes/${sess_id}`)
          .expect(404, { error: { message: `Session notes don't exist` } })
      });
    });

    context('Given there are session notes in the database', () => {
        const testUsers = makeUsersArray();
        const testSessions = makeSessionsArray();
        const testSessionNotes = makeSessionNotesArray();
  
        beforeEach('insert session notes', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
            .then(() => {
                return db 
                  .into('session_notes')
                  .insert(testSessionNotes)
            })
        });

      it('responds with 200 and the specified session notes', () => {
        const sess_id = 2
        const expectedSessionNote = testSessionNotes[sess_id - 1]
        return supertest(app)
          .get(`/api/session-notes/${sess_id}`)
          .expect(200, expectedSessionNote)
      });
    });

    context(`Given an XSS attack content`, () => {
        const testUsers = makeUsersArray();
        const testSessions = makeSessionsArray();
        const { maliciousSessionNote, expectedSessionNote } = makeMaliciousSessionNotes();
  
        beforeEach('insert malicious game', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
            .then(() => {
                return db
                  .into('session_notes')
                  .insert(maliciousSessionNote)
            })
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/session-notes/${maliciousSessionNote.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.note).to.eql(expectedSessionNote.note)
          })
      });
    });
  });

  describe(`POST /api/session-notes`, () => {

    it(`creates a session note, responding with 201 and the new session note`, () => {
      const newSessionNote = {
        session_id: 5,
        uid: 1,
        note: 'I did X and it was good.'
      };

      return supertest(app)
        .post('/api/session-notes')
        .send(newSessionNote)
        .expect(201)
        .expect(res => {
          expect(res.body.session_id).to.eql(newSessionNote.session_id)
          expect(res.body.uid).to.eql(newSessionNote.uid)
          expect(res.body.note).to.eql(newSessionNote.note)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/session-notes/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/session-notes/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'session_id', 'uid', 'note' ];

    requiredFields.forEach(field => {
        const newSessionNote = {
            session_id: 5,
            uid: 1,
            note: 'Some note'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSessionNote[field]

        return supertest(app)
          .post('/api/session-notes')
          .send(newSessionNote)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousSessionNote, expectedSessionNote } = makeMaliciousSessionNotes();
      return supertest(app)
        .post(`/api/session-notes`)
        .send(maliciousSessionNote)
        .expect(201)
        .expect(res => {
            expect(res.body.note).to.eql(expectedSessionNote.note)
        })
    });
  });

  describe(`DELETE /api/session-notes/:sess_id`, () => {
    context(`Given no session notes`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/session-notes/${sess_id}`)
          .expect(404, { error: { message: `Session notes don't exist` } })
      })
    });

    context('Given there are sessions notes in the database', () => {
        const testUsers = makeUsersArray();
        const testSessions = makeSessionsArray();
        const testSessionNotes = makeSessionNotesArray();
  
        beforeEach('insert session scores', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
            .then(() => {
                return db 
                  .into('session_notes')
                  .insert(testSessionNotes)
            })
        });

      it('responds with 204 and removes the note', () => {
        const idToRemove = 2
        const expectedSessionNote = testSessionNotes.filter(sess => sess.id !== idToRemove)
        return supertest(app)
          .delete(`/api/session-notes/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/session-notes`)
              .expect(expectedSessionNote)
          )
      });
    });
  });

  describe(`PATCH /api/session-notes/:sess_id`, () => {
    context(`Given no session notes`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/session-notes/${sess_id}`)
          .expect(404, { error: { message: `Session notes don't exist` } })
      })
    });

    context('Given there are session notes in the database', () => {
        const testUsers = makeUsersArray();
        const testSessions = makeSessionsArray();
        const testSessionNotes = makeSessionNotesArray();
  
        beforeEach('insert session scores', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
            .then(() => {
                return db 
                  .into('session_notes')
                  .insert(testSessionNotes)
            })
        });

      it('responds with 204 and updates the session notes', () => {
        const idToUpdate = 2;
        const updateSessionNote = {
          session_id: 2,
          uid: 1,
          note: 'Some note'
        };
        const expectedSessionNote = {
          ...testSessionNotes[idToUpdate - 1],
          ...updateSessionNote
        };
        return supertest(app)
          .patch(`/api/session-notes/${idToUpdate}`)
          .send(updateSessionNote)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/session-notes/${idToUpdate}`)
              .expect(expectedSessionNote)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/session-notes/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a session ID, user ID, and note`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateSessionNote = {
            note: 'New note',
        };
        const expectedSessionNote = {
          ...testSessionNotes[idToUpdate - 1],
          ...updateSessionNote
        };

        return supertest(app)
          .patch(`/api/session-notes/${idToUpdate}`)
          .send({
            ...updateSessionNote,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/session-notes/${idToUpdate}`)
              .expect(expectedSessionNote)
          )
      });
    });
    });
});