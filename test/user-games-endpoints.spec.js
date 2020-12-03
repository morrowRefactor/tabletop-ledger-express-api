const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserGamesArray, makeMaliciousUserGames } = require('./user-games.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('User Games Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, user_games RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, user_games RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-games`, () => {
    context(`Given no user games`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-games')
          .expect(200, [])
      })
    });

    context('Given there are user games in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserGames = makeUserGamesArray();

      beforeEach('insert user games', () => {
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
                .into('user_games')
                .insert(testUserGames)
          })
      });

      it('responds with 200 and all of the user games', () => {
        return supertest(app)
          .get('/api/user-games')
          .expect(200, testUserGames)
        });
    });

    context(`Given an XSS attack user game`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const { maliciousUserGame, expectedUserGame } = makeMaliciousUserGames();

      beforeEach('insert malicious user game', () => {
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
                .into('user_games')
                .insert(maliciousUserGame)
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/user-games`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].notes).to.eql(expectedUserGame.notes)
          })
      });
    });
  });

  describe(`GET /api/user-games/:game_id`, () => {
    context(`Given no user games`, () => {
      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .get(`/api/user-games/${game_id}`)
          .expect(404, { error: { message: `User game doesn't exist` } })
      });
    });

    context('Given there are user games in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserGames = makeUserGamesArray();
  
        beforeEach('insert user games', () => {
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
                  .into('user_games')
                  .insert(testUserGames)
            })
        });

      it('responds with 200 and the specified user games', () => {
        const game_id = 2
        const expectedUserGame = testUserGames[game_id - 1]
        return supertest(app)
          .get(`/api/user-games/${game_id}`)
          .expect(200, expectedUserGame)
      });
    });

    context(`Given an XSS attack content`, () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const { maliciousUserGame, expectedUserGame } = makeMaliciousUserGames();
  
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
                  .into('user_games')
                  .insert(maliciousUserGame)
            })
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/user-games/${maliciousUserGame.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.notes).to.eql(expectedUserGame.notes)
          })
      });
    });
  });

  describe(`POST /api/user-games`, () => {

    context('Given there are user games in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }


      beforeEach('insert user games', () => {
        return db
          .into('games')
          .insert(testGames)
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
      
      it(`creates a user game, responding with 201 and the new user game`, () => {
        const newUserGame = {
          uid: 1,
          game_id: 1,
          own: true,
          favorite: 6,
          rating: '7.7',
          notes: 'good stuff'
        };

        return supertest(app)
          .post('/api/user-games')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newUserGame)
          .expect(201)
          .expect(res => {
            expect(res.body.game_id).to.eql(newUserGame.game_id)
            expect(res.body.uid).to.eql(newUserGame.uid)
            expect(res.body.own).to.eql(newUserGame.own)
            expect(res.body.favorite).to.eql(newUserGame.favorite)
            expect(res.body.rating).to.eql(newUserGame.rating)
            expect(res.body.notes).to.eql(newUserGame.notes)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/user-games/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/user-games/${res.body.id}`)
              .expect(res.body)
          )
      });
      
      const requiredFields = [ 'uid', 'game_id' ];

      requiredFields.forEach(field => {
          const newUserGame = {
              uid: 1,
              game_id: 1
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newUserGame[field]

          return supertest(app)
            .post('/api/user-games')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newUserGame)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });

      it('removes XSS attack content from response', () => {
        const { maliciousUserGame, expectedUserGame } = makeMaliciousUserGames();
        return supertest(app)
          .post(`/api/user-games`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(maliciousUserGame)
          .expect(201)
          .expect(res => {
              expect(res.body.notes).to.eql(expectedUserGame.notes)
          })
      });
  });
  });

  describe(`DELETE /api/user-games/:game_id`, () => {
    context(`Given no user games`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserGames = makeUserGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }


      beforeEach('insert user games', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
            return db
              .into('user_games')
              .insert(testUserGames)
          })
      });

      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .delete(`/api/user-games/${game_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User game doesn't exist` } })
      })
    });

    context('Given there are user games in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserGames = makeUserGamesArray();
  
        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }
  
  
        beforeEach('insert user games', () => {
          return db
            .into('games')
            .insert(testGames)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            })
            .then(() => {
              return db
                .into('user_games')
                .insert(testUserGames)
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
        const idToRemove = 2;
        const expectedUserGame = testUserGames.filter(game => game.id !== idToRemove);
        return supertest(app)
          .delete(`/api/user-games/${idToRemove}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-games`)
              .expect(expectedUserGame)
          )
      });
    });
  });

  describe(`PATCH /api/user-games/:game_id`, () => {
    context(`Given no user games`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserGames = makeUserGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }


      beforeEach('insert user games', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
            return db
              .into('user_games')
              .insert(testUserGames)
          })
      });

      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .patch(`/api/user-games/${game_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User game doesn't exist` } })
      })
    });

    context('Given there are user games in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserGames = makeUserGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }


      beforeEach('insert user games', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
            return db
              .into('user_games')
              .insert(testUserGames)
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

      it('responds with 204 and updates the user reccos', () => {
        const idToUpdate = 2;
        const updateUserGame = {
          uid: 1,
          game_id: 4,
          own: false, 
          favorite: 5,
          rating: '7.0',
          notes: 'New note'
        };
        const expectedUserGame = {
          ...testUserGames[idToUpdate - 1],
          ...updateUserGame
        };
        return supertest(app)
          .patch(`/api/user-games/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(updateUserGame)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-games/${idToUpdate}`)
              .expect(expectedUserGame)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-games/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID and game ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserGame = {
            game_id: 9,
            rating: '9.0',
            notes: 'new note'
        };
        const expectedUserGame = {
          ...testUserGames[idToUpdate - 1],
          ...updateUserGame
        };

        return supertest(app)
          .patch(`/api/user-games/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({
            ...updateUserGame,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-games/${idToUpdate}`)
              .expect(expectedUserGame)
          )
      });
    });
    });
});