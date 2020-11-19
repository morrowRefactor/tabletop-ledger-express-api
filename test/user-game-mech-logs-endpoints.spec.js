const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserGameMechLogsArray } = require('./user-game-mech-logs.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeMechGamesArray }  = require('./games-mech.fixtures');
const { updateUserGameCatLog } = require('../src/user-game-cat-logs/user-game-cat-logs-service');

describe('User Sessions by Game Mechanic Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games_mech, user_game_mech_logs RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games_mech, user_game_mech_logs RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-game-mech-logs`, () => {
    context(`Given no user game sessions by mechanic`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-game-mech-logs')
          .expect(200, [])
      })
    });

    context('Given there are user game sessions by mechanic in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesMech = makeMechGamesArray();
        const testUserGameMechLogs = makeUserGameMechLogsArray();

      beforeEach('insert user game sessions by mechanic', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('user_game_mech_logs')
                    .insert(testUserGameMechLogs)
            })  
      });

      it('responds with 200 and all of the user game sessions by mechanic', () => {
        return supertest(app)
          .get('/api/user-game-mech-logs')
          .expect(200, testUserGameMechLogs)
        });
    });
  });

  describe(`GET /api/user-game-mech-logs/:id`, () => {
    context(`Given no user game sessions by mechanic`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .get(`/api/user-game-mech-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this mechanic don't exist` } })
      });
    });

    context('Given there are user game sessions by mechanic in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesMech = makeMechGamesArray();
        const testUserGameMechLogs = makeUserGameMechLogsArray();

      beforeEach('insert user game sessions by mechanic', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('user_game_mech_logs')
                    .insert(testUserGameMechLogs)
            })  
      });

      it('responds with 200 and the specified user game mechanic logs', () => {
        const id = 2;
        const expectedUserGameMechLog = testUserGameMechLogs[id - 1];
        return supertest(app)
          .get(`/api/user-game-mech-logs/${id}`)
          .expect(200, expectedUserGameMechLog)
      });
    });
  });

  describe(`POST /api/user-game-mech-logs`, () => {
    const testUsers = makeUsersArray();
    const testGamesMech = makeMechGamesArray();

    beforeEach('insert user game sessions by mechanic', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            }) 
    });

    it(`creates a user game mechanic log, responding with 201 and the new user game mechanic log`, () => {
      const newUserGameMechLog = [
        {
          mech_id: 123,
          uid: 2,
          sessions: 4
        },
        {
          mech_id: 234,
          uid: 2,
          sessions: 8
        }
      ];

      return supertest(app)
        .post('/api/user-game-mech-logs')
        .send(newUserGameMechLog)
        .expect(201)
    });

    const requiredFields = [ 'mech_id', 'uid', 'sessions' ];

    requiredFields.forEach(field => {
        const newUserGameMechLog = [{
            mech_id: 345,
            uid: 3,
            sessions: 4
        }];

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserGameMechLog[0][field]

        return supertest(app)
          .post('/api/user-game-mech-logs')
          .send(newUserGameMechLog)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/user-game-mech-logs/:id`, () => {
    context(`Given no user game sessions by mechanic`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/user-game-mech-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this mechanic don't exist` } })
      })
    });

    context('Given there are user game sessions by mechanic in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesMech = makeMechGamesArray();
        const testUserGameMechLogs = makeUserGameMechLogsArray();

      beforeEach('insert user game sessions by mechanic', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('user_game_mech_logs')
                    .insert(testUserGameMechLogs)
            })  
      });

      it('responds with 204 and removes the user game mechanic log', () => {
        const idToRemove = 2;
        const expectedUserGameMechLog = testUserGameMechLogs.filter(log => log.id !== idToRemove);
        return supertest(app)
          .delete(`/api/user-game-mech-logs/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-game-mech-logs`)
              .expect(expectedUserGameMechLog)
          )
      });
    });
  });

  describe(`PATCH /api/user-game-mech-logs`, () => {
    context(`Given no user game sessions by mechanic`, () => {
      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/user-game-mech-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this mechanic don't exist` } })
      })
    });

    context('Given there are user game sessions by mechanic in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesMech = makeMechGamesArray();
        const testUserGameMechLogs = makeUserGameMechLogsArray();

      beforeEach('insert user game sessions by mechanic', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('user_game_mech_logs')
                    .insert(testUserGameMechLogs)
            })  
      });

      it('responds with 204 and updates the user games by mechanic log', () => {
        const updateUserGameMechLog = [{
          id: 1,
          mech_id: 123,
          uid: 1,
          sessions: 6
        },
        {
          id: 2,
          mech_id: 234,
          uid: 1,
          sessions: 4
        }];
        
        updateUserGameMechLog.forEach(log => {
          return supertest(app)
          .patch(`/api/user-game-mech-logs/${log.id}`)
          .send(log)
          .expect(204)
        })
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/user-game-mech-logs/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID, mechanic ID, and session number`
            }
          })
      });
    });
    });
});