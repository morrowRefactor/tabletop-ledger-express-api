const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserGameCatLogsArray } = require('./user-game-cat-logs.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeCatGamesArray}  = require('./games-cat.fixtures');

describe('User Sessions by Game Category Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games_cat, user_game_cat_logs RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games_cat, user_game_cat_logs RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-game-cat-logs`, () => {
    context(`Given no user game sessions by category`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-game-cat-logs')
          .expect(200, [])
      })
    });

    context('Given there are user game sessions by category in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesCat = makeCatGamesArray();
        const testUserGameCatLogs = makeUserGameCatLogsArray();

      beforeEach('insert user game sessions by category', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('user_game_cat_logs')
                    .insert(testUserGameCatLogs)
            })  
      });

      it('responds with 200 and all of the user game sessions by category', () => {
        return supertest(app)
          .get('/api/user-game-cat-logs')
          .expect(200, testUserGameCatLogs)
        });
    });
  });

  describe(`GET /api/user-game-cat-logs/:id`, () => {
    context(`Given no user game sessions by category`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .get(`/api/user-game-cat-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this category don't exist` } })
      });
    });

    context('Given there are user game sessions by category in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesCat = makeCatGamesArray();
        const testUserGameCatLogs = makeUserGameCatLogsArray();

      beforeEach('insert user game sessions by category', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('user_game_cat_logs')
                    .insert(testUserGameCatLogs)
            })  
      });

      it('responds with 200 and the specified user game category logs', () => {
        const id = 2;
        const expectedUserGameCatLog = testUserGameCatLogs[id - 1];
        return supertest(app)
          .get(`/api/user-game-cat-logs/${id}`)
          .expect(200, expectedUserGameCatLog)
      });
    });
  });

  describe(`POST /api/user-game-cat-logs`, () => {
    const testUsers = makeUsersArray();
    const testGamesCat = makeCatGamesArray();

    beforeEach('insert user game sessions by category', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            }) 
    });

    it(`creates a user game category log, responding with 201 and the new user game category log`, () => {
      const newUserGameCatLog = [
        {
          cat_id: 123,
          uid: 2,
          sessions: 4
        },
        {
          cat_id: 234,
          uid: 2,
          sessions: 8
        }
      ];

      return supertest(app)
        .post('/api/user-game-cat-logs')
        .send(newUserGameCatLog)
        .expect(201)
    });

    const requiredFields = [ 'cat_id', 'uid', 'sessions' ];

    requiredFields.forEach(field => {
        const newUserGameCatLog = [{
            cat_id: 345,
            uid: 3,
            sessions: 4
        }];

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserGameCatLog[0][field]

        return supertest(app)
          .post('/api/user-game-cat-logs')
          .send(newUserGameCatLog)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/user-game-cat-logs/:id`, () => {
    context(`Given no user game sessions by category`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/user-game-cat-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this category don't exist` } })
      })
    });

    context('Given there are user game sessions by category in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesCat = makeCatGamesArray();
        const testUserGameCatLogs = makeUserGameCatLogsArray();

      beforeEach('insert user game sessions by category', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('user_game_cat_logs')
                    .insert(testUserGameCatLogs)
            })  
      });

      it('responds with 204 and removes the user game category log', () => {
        const idToRemove = 2;
        const expectedUserGameCatLog = testUserGameCatLogs.filter(log => log.id !== idToRemove);
        return supertest(app)
          .delete(`/api/user-game-cat-logs/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-game-cat-logs`)
              .expect(expectedUserGameCatLog)
          )
      });
    });
  });

  describe(`PATCH /api/user-game-cat-logs/:id`, () => {
    context(`Given no user game sessions by category`, () => {
      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/user-game-cat-logs/${id}`)
          .expect(404, { error: { message: `User sessions for this category don't exist` } })
      })
    });

    context('Given there are user game sessions by category in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesCat = makeCatGamesArray();
        const testUserGameCatLogs = makeUserGameCatLogsArray();

      beforeEach('insert user game sessions by category', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('user_game_cat_logs')
                    .insert(testUserGameCatLogs)
            })  
      });

      it('responds with 204 and updates the user games by category log', () => {
        const idToUpdate = 2;
        const updateUserGameCatLog = {
          cat_id: 345,
          uid: 1,
          sessions: 4
        };
        const expectedUserGameCatLog = {
          ...testUserGameCatLogs[idToUpdate - 1],
          ...updateUserGameCatLog
        };
        
        return supertest(app)
          .patch(`/api/user-game-cat-logs/${idToUpdate}`)
          .send(updateUserGameCatLog)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-game-cat-logs/${idToUpdate}`)
              .expect(expectedUserGameCatLog)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-game-cat-logs/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a category ID, user ID, and number of sessions`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserGameCatLog = {
            cat_id: 345,
            uid: 1,
            sessions: 4
        };
        const expectedUserGameCatLog = {
          ...testUserGameCatLogs[idToUpdate - 1],
          ...updateUserGameCatLog
        };

        return supertest(app)
          .patch(`/api/user-game-cat-logs/${idToUpdate}`)
          .send({
            ...updateUserGameCatLog,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-game-cat-logs/${idToUpdate}`)
              .expect(expectedUserGameCatLog)
          )
      });
    });
    });
});