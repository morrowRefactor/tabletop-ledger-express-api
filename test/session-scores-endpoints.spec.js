const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeSessionScoresArray, makeMaliciousSessionScores } = require('./session-scores.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const { makeSessionsWIDArray } = require('./sessions.fixtures');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('Session Scores Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, sessions, session_scores RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, sessions, session_scores RESTART IDENTITY CASCADE'));

  describe(`GET /api/session-scores`, () => {
    context(`Given no session scores`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/session-scores')
          .expect(200, [])
      })
    });

    context('Given there are session scores in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();
      const testSessionScores = makeSessionScoresArray();

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
          .then(() => {
              return db 
                .into('session_scores')
                .insert(testSessionScores)
          })
      });

      it('responds with 200 and all of the session scores', () => {
        return supertest(app)
          .get('/api/session-scores')
          .expect(200, testSessionScores)
        });
    });

    context(`Given an XSS attack scores`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();
      const { maliciousSessionScore, expectedSessionScore } = makeMaliciousSessionScores();

      beforeEach('insert malicious score', () => {
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
          .then(() => {
              return db
                .into('session_scores')
                .insert(maliciousSessionScore[0])
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/session-scores`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedSessionScore[0].name)
          })
      });
    });
  });

  describe(`GET /api/session-scores/:sess_id`, () => {
    context(`Given no session scores`, () => {
      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .get(`/api/session-scores/${sess_id}`)
          .expect(404, { error: { message: `Session scores don't exist` } })
      });
    });

    context('Given there are session scores in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsWIDArray();
        const testSessionScores = makeSessionScoresArray();
  
        beforeEach('insert session scores', () => {
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
            .then(() => {
                return db 
                  .into('session_scores')
                  .insert(testSessionScores)
            })
        });

      it('responds with 200 and the specified session scores', () => {
        const sess_id = 2
        const expectedSessionScore = testSessionScores[sess_id - 1]
        return supertest(app)
          .get(`/api/session-scores/${sess_id}`)
          .expect(200, expectedSessionScore)
      });
    });

    context(`Given an XSS attack content`, () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsWIDArray();
        const { maliciousSessionScore, expectedSessionScore } = makeMaliciousSessionScores();
  
        beforeEach('insert malicious game', () => {
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
            .then(() => {
                return db
                  .into('session_scores')
                  .insert(maliciousSessionScore[0])
            })
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/session-scores/${maliciousSessionScore[0].id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedSessionScore[0].name)
          })
      });
    });
  });

  describe(`POST /api/session-scores`, () => {
      
    context('Given there are sessions in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert session scores', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
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


      it(`creates a session score, responding with 201 and the new session score`, () => {
        const newSessionScores = [
          {
            session_id: 5,
            game_id: 1,
            uid: 1,
            score: '88',
            name: 'John Doe',
            winner: true
          },
          {
            session_id: 5,
            game_id: 1,
            uid: null,
            score: '78',
            name: 'Some Guy',
            winner: false
          }
        ];

        return supertest(app)
          .post('/api/session-scores')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newSessionScores)
          .expect(201)
      });
    
    const requiredFields = [ 'session_id', 'game_id', 'name', 'winner' ];

    requiredFields.forEach(field => {
        const newSessionScores = [{
            session_id: 5,
            game_id: 1,
            score: '88',
            name: 'John Doe',
            winner: true
        }];

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSessionScores[0][field]

        return supertest(app)
          .post('/api/session-scores')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newSessionScores)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });
  });

  describe(`DELETE /api/session-scores/:sess_id`, () => {
    context(`Given no session scores`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }


      beforeEach('insert session scores', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
      });

      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/session-scores/${sess_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Session scores don't exist` } })
      })
    });

    context('Given there are sessions scores in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testSessions = makeSessionsWIDArray();
        const testSessionScores = makeSessionScoresArray();

        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }
  

        beforeEach('insert session scores', () => {
          return db
            .into('games')
            .insert(testGames)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            })
            .then(() => {
                return db
                  .into('sessions')
                  .insert(testSessions)
            })
            .then(() => {
              return db 
                .into('session_scores')
                .insert(testSessionScores)
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

        it('responds with 204 and removes the game', () => {
          const idToRemove = 2
          const expectedSessionScore = testSessionScores.filter(sess => sess.id !== idToRemove)
          return supertest(app)
            .delete(`/api/session-scores/${idToRemove}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/session-scores`)
                .expect(expectedSessionScore)
            )
        });
    });
  });

  describe(`PATCH /api/session-scores/:sess_id`, () => {
    context(`Given no session scores`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert session scores', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
      });

      it(`responds with 404`, () => {
        const sess_id = 123;
        return supertest(app)
          .delete(`/api/session-scores/${sess_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Session scores don't exist` } })
      })
    });

    context('Given there are session scores in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testSessions = makeSessionsWIDArray();
      const testSessionScores = makeSessionScoresArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert session scores', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
              return db
                .into('sessions')
                .insert(testSessions)
          })
          .then(() => {
            return db 
              .into('session_scores')
              .insert(testSessionScores)
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

      it('responds with 204 and updates the session scores', () => {
        const idToUpdate = 2;
        const updateSessionScore = {
          session_id: 2,
          game_id: 2,
          score: '22',
          name: 'New Guy',
          winner: false
        };
        const expectedSessionScore = {
          ...testSessionScores[idToUpdate - 1],
          ...updateSessionScore
        };
        return supertest(app)
          .patch(`/api/session-scores/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(updateSessionScore)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/session-scores/${idToUpdate}`)
              .expect(expectedSessionScore)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/session-scores/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a session ID, game ID, score, name, and winner`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateSessionScore = {
            score: '22',
            name: 'New Guy',
        };
        const expectedSessionScore = {
          ...testSessionScores[idToUpdate - 1],
          ...updateSessionScore
        };

        return supertest(app)
          .patch(`/api/session-scores/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({
            ...updateSessionScore,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/session-scores/${idToUpdate}`)
              .expect(expectedSessionScore)
          )
      });
    });
    });
});