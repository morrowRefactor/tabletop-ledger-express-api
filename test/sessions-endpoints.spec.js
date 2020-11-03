const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeSessionsArray, makeSessionsWIDArray } = require('./sessions.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');

describe('Sessions Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, sessions RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, sessions RESTART IDENTITY CASCADE'));

  describe(`GET /api/sessions`, () => {
    context(`Given no sessions`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/sessions')
          .expect(200, [])
      })
    });

    context('Given there are sessions in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsArray();
      const sessionsWIDs = makeSessionsWIDArray();

      beforeEach('insert sessions', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db 
                .into('games')
                .insert(testGames)
          })
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
      });

      it('responds with 200 and all of the games', () => {
        return supertest(app)
          .get('/api/sessions')
          .expect(200, sessionsWIDs)
        });
    });
  });

  describe(`GET /api/sessions/:sess_id`, () => {
    context(`Given no session`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .get(`/api/sessions/${sess_id}`)
          .expect(404, { error: { message: `Session doesn't exist` } })
      });
    });

    context('Given there are sessions in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsArray();
        const sessionsWIDs = makeSessionsWIDArray();
  
        beforeEach('insert sessions', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db 
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
        });

      it('responds with 200 and the specified session', () => {
        const sess_id = 2
        const expectedSession = sessionsWIDs[sess_id - 1]
        return supertest(app)
          .get(`/api/sessions/${sess_id}`)
          .expect(200, expectedSession)
      });
    });
  });

  describe(`GET /api/sessions/user-sessions/:uid`, () => {
    context(`Given no session`, () => {
      it(`responds with 404`, () => {
        const uid = 123;
        return supertest(app)
          .get(`/api/sessions/user-sessions/${uid}`)
          .expect(404, { error: { message: `User sessions don't exist` } })
      });
    });

    context('Given there are sessions in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsArray();
        const sessionsWIDs = makeSessionsWIDArray();
  
        beforeEach('insert sessions', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db 
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
        });

      it('responds with 200 and the specified session', () => {
        const uid = 1
        const expectedSession = [
          {
              "id": 4,
              "game_id": 3,
              "uid": 1,
              "date": "2020-07-29T07:00:00.000Z"
          },
          {
              "id": 10,
              "game_id": 10,
              "uid": 1,
              "date": "2020-03-02T08:00:00.000Z"
          }
        ];

        return supertest(app)
          .get(`/api/sessions/user-sessions/${uid}`)
          .expect(200, expectedSession)
      });
    });
  });

  describe.only(`GET /api/sessions/game-sessions/:game_id`, () => {
    context(`Given no session`, () => {
      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .get(`/api/sessions/game-sessions/${game_id}`)
          .expect(404, { error: { message: `Game sessions don't exist` } })
      });
    });

    context('Given there are sessions in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsArray();
        const sessionsWIDs = makeSessionsWIDArray();
  
        beforeEach('insert sessions', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db 
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
        });

      it('responds with 200 and the specified session', () => {
        const game_id = 1
        const expectedSession = [
          {
            "game_id": 1,
            "cnt": "5",
          },
          {
            "game_id": 3,
            "cnt": "2",
          },
          {
            "game_id": 4,
            "cnt": "1",
          },
          {
            "game_id": 10,
            "cnt": "1",
          },
          {
            "game_id": 7,
            "cnt": "1",
          }
        ];

        return supertest(app)
          .get(`/api/sessions/game-sessions/${game_id}`)
          .expect(200, expectedSession)
      });
    });
  });

  describe(`POST /api/sessions`, () => {
    const testUsers = makeUsersArray();
    const testGames = makeGamesArray();
    const testSessions = makeSessionsArray();

    beforeEach('insert sessions', () => {
      return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db 
              .into('games')
              .insert(testGames)
        })
        .then(() => {
            return db
              .into('sessions')
              .insert(testSessions)
        })
    });

    it(`creates a session, responding with 201 and the new session`, () => {
      const newSession = {
        game_id: 1,
        uid: 2,
        date: '2020-08-02'
      };

      return supertest(app)
        .post('/api/sessions')
        .send(newSession)
        .expect(201)
        .expect(res => {
          expect(res.body.game_id).to.eql(newSession.game_id)
          expect(res.body.uid).to.eql(newSession.uid)
          expect(res.body.date).to.eql(newSession.date)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/sessions/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/sessions/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = ['game_id', 'uid', 'date'];

    requiredFields.forEach(field => {
        const newSession = {
            game_id: 2,
            uid: 2,
            date: '2020-05-07',
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSession[field]

        return supertest(app)
          .post('/api/sessions')
          .send(newSession)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/sessions/:sess_id`, () => {
    context(`Given no sessions`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/sessions/${sess_id}`)
          .expect(404, { error: { message: `Session doesn't exist` } })
      })
    });

    context('Given there are sessions in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsArray();
        const sessionsWIDs = makeSessionsWIDArray();
  
        beforeEach('insert sessions', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db 
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
        });

      it('responds with 204 and removes the session', () => {
        const idToRemove = 2
        const expectedSession = sessionsWIDs.filter(sess => sess.id !== idToRemove)
        return supertest(app)
          .delete(`/api/sessions/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/sessions`)
              .expect(expectedSession)
          )
      });
    });
  });

  describe(`PATCH /api/sessions/:sess_id`, () => {
    context(`Given no sessions`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/sessions/${sess_id}`)
          .expect(404, { error: { message: `Session doesn't exist` } })
      })
    });

    context('Given there are sessions in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsArray();
        const sessionsWIDs = makeSessionsWIDArray();
  
        beforeEach('insert sessions', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db 
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
        });

      it('responds with 204 and updates the session', () => {
        const idToUpdate = 2;
        const updateSession = {
          game_id: 1,
          uid: 2,
          date: '2020-05-07'
        };
        const expectedSession = {
          ...sessionsWIDs[idToUpdate - 1],
          ...updateSession
        };
        return supertest(app)
          .patch(`/api/sessions/${idToUpdate}`)
          .send(updateSession)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/sessions/${idToUpdate}`)
              .expect(expectedSession)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/sessions/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a game ID, user ID, and session date`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateSession = {
            game_id: 4
        };
        const expectedSession = {
          ...sessionsWIDs[idToUpdate - 1],
          ...updateSession
        };

        return supertest(app)
          .patch(`/api/sessions/${idToUpdate}`)
          .send({
            ...updateSession,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/sessions/${idToUpdate}`)
              .expect(expectedSession)
          )
      });
    });
    });
});