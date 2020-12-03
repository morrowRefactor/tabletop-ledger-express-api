const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserGameCatLogsArray } = require('./user-game-cat-logs.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeCatGamesArray}  = require('./games-cat.fixtures');
const { updateCatGameMatch } = require('../src/games-cat-matches/games-cat-matches-service');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

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

  afterEach('cleanup',() => db.raw('TRUNCATE user_game_cat_logs, games_cat, users RESTART IDENTITY CASCADE'));

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

    function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
      const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.name,
        algorithm: 'HS256',
      });

      return `Bearer ${token}`
    }


    beforeEach('insert user game sessions by category', () => {
        return db
            .into('games_cat')
            .insert(testGamesCat)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            }) 
    });

    it(`responds 401 'Missing bearer token' when no bearer token`, () => {
      return supertest(app)
        .post('/api/game-tips')
        .expect(401, { error: `Missing bearer token` })
    });

    it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
      const validUser = testUsers[0];
      const invalidSecret = 'bad-secret';
      return supertest(app)
        .post('/api/game-tips')
        .set('Authorization', makeAuthHeader(validUser, invalidSecret))
        .expect(401, { error: `Unauthorized request` })
    });
    
    it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
      const invalidUser = { name: 'user-not-existy', id: 1 };
      return supertest(app)
        .post('/api/game-tips')
        .set('Authorization', makeAuthHeader(invalidUser))
        .expect(401, { error: `Unauthorized request` })
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
        .set('Authorization', makeAuthHeader(testUsers[0]))
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
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newUserGameCatLog)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/user-game-cat-logs/:id`, () => {
    context(`Given no user game sessions by category`, () => {
      const testUsers = makeUsersArray();
      const testGamesCat = makeCatGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert user game sessions by category', () => {
          return db
              .into('games_cat')
              .insert(testGamesCat)
              .then(() => {
                helpers.seedUsers(db, testUsers)
              }) 
      });

      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/user-game-cat-logs/${id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User sessions for this category don't exist` } })
      })
    });

    context('Given there are user game sessions by category in the database', () => {
        const testUsers = makeUsersArray();
        const testGamesCat = makeCatGamesArray();
        const testUserGameCatLogs = makeUserGameCatLogsArray();

        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }
    
        beforeEach('insert user game sessions by category', () => {
            return db
                .into('games_cat')
                .insert(testGamesCat)
                .then(() => {
                  helpers.seedUsers(db, testUsers)
                }) 
                .then(() => {
                  return db
                      .into('user_game_cat_logs')
                      .insert(testUserGameCatLogs)
              })
        });

        it(`responds 401 'Missing bearer token' when no bearer token`, () => {
          return supertest(app)
            .post('/api/game-tips')
            .expect(401, { error: `Missing bearer token` })
        });
  
        it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
          const validUser = testUsers[0];
          const invalidSecret = 'bad-secret';
          return supertest(app)
            .post('/api/game-tips')
            .set('Authorization', makeAuthHeader(validUser, invalidSecret))
            .expect(401, { error: `Unauthorized request` })
        });
        
        it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
          const invalidUser = { name: 'user-not-existy', id: 1 };
          return supertest(app)
            .post('/api/game-tips')
            .set('Authorization', makeAuthHeader(invalidUser))
            .expect(401, { error: `Unauthorized request` })
        });

        it('responds with 204 and removes the user game category log', () => {
          const idToRemove = 2;
          const expectedUserGameCatLog = testUserGameCatLogs.filter(log => log.id !== idToRemove);
          return supertest(app)
            .delete(`/api/user-game-cat-logs/${idToRemove}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/user-game-cat-logs`)
                .expect(expectedUserGameCatLog)
            )
        });
    });
  });

  describe(`PATCH /api/user-game-cat-logs`, () => {
    context(`Given no user game sessions by category`, () => {
      const testUsers = makeUsersArray();
      const testGamesCat = makeCatGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert user game sessions by category', () => {
          return db
              .into('games_cat')
              .insert(testGamesCat)
              .then(() => {
                helpers.seedUsers(db, testUsers)
              }) 
      });

      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/user-game-cat-logs/${id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User sessions for this category don't exist` } })
      })
    });

    context('Given there are user game sessions by category in the database', () => {
      const testUsers = makeUsersArray();
      const testGamesCat = makeCatGamesArray();
      const testUserGameCatLogs = makeUserGameCatLogsArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }
  
      beforeEach('insert user game sessions by category', () => {
          return db
              .into('games_cat')
              .insert(testGamesCat)
              .then(() => {
                helpers.seedUsers(db, testUsers)
              }) 
              .then(() => {
                return db
                    .into('user_game_cat_logs')
                    .insert(testUserGameCatLogs)
            })
      });

      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return supertest(app)
          .post('/api/game-tips')
          .expect(401, { error: `Missing bearer token` })
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return supertest(app)
          .post('/api/game-tips')
          .set('Authorization', makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      });
      
      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { name: 'user-not-existy', id: 1 };
        return supertest(app)
          .post('/api/game-tips')
          .set('Authorization', makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      });

      it('responds with 204 and updates the user games by category log', () => {
        const updateUserGameCatLog = [{
          id: 1,
          cat_id: 123,
          uid: 1,
          sessions: 6
        },
        {
          id: 2,
          cat_id: 234,
          uid: 1,
          sessions: 4
        }];
        
        updateUserGameCatLog.forEach(log => {
          return supertest(app)
          .patch(`/api/user-game-cat-logs/${log.id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(log)
          .expect(204)
        })
      });
      
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/user-game-cat-logs/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID, category ID, and session number`
            }
          })
      });
    });
    });
});