const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserReccosArray, makeMaliciousUserReccos } = require('./user-reccos.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('User Reccos Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, user_reccos RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, user_reccos RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-reccos`, () => {
    context(`Given no user reccos`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-reccos')
          .expect(200, [])
      })
    });

    context('Given there are user reccos in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserReccos = makeUserReccosArray();

      beforeEach('insert user reccos', () => {
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
                .into('user_reccos')
                .insert(testUserReccos)
          })
      });

      it('responds with 200 and all of the user reccos', () => {
        return supertest(app)
          .get('/api/user-reccos')
          .expect(200, testUserReccos)
        });
    });

    context(`Given an XSS attack user recco`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const { maliciousUserRecco, expectedUserRecco } = makeMaliciousUserReccos();

      beforeEach('insert malicious user recco', () => {
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
                .into('user_reccos')
                .insert(maliciousUserRecco)
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/user-reccos`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].note).to.eql(expectedUserRecco.note)
          })
      });
    });
  });

  describe(`GET /api/user-reccos/:recco_id`, () => {
    context(`Given no user reccos`, () => {
      it(`responds with 404`, () => {
        const recco_id = 123;
        return supertest(app)
          .get(`/api/user-reccos/${recco_id}`)
          .expect(404, { error: { message: `User recco doesn't exist` } })
      });
    });

    context('Given there are user reccos in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserReccos = makeUserReccosArray();
  
        beforeEach('insert user reccos', () => {
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
                  .into('user_reccos')
                  .insert(testUserReccos)
            })
        });

      it('responds with 200 and the specified user reccos', () => {
        const recco_id = 2
        const expectedUserRecco = testUserReccos[recco_id - 1]
        return supertest(app)
          .get(`/api/user-reccos/${recco_id}`)
          .expect(200, expectedUserRecco)
      });
    });

    context(`Given an XSS attack content`, () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const { maliciousUserRecco, expectedUserRecco } = makeMaliciousUserReccos();
  
        beforeEach('insert malicious recco', () => {
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
                  .into('user_reccos')
                  .insert(maliciousUserRecco)
            })
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/user-reccos/${maliciousUserRecco.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.note).to.eql(expectedUserRecco.note)
          })
      });
    });
  });

  describe(`POST /api/user-reccos`, () => {

    context('Given there are user reccos in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert user reccos', () => {
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

      it(`creates a use recco, responding with 201 and the new user recco`, () => {
        const newUserRecco = {
          uid: 1,
          game_id: 1,
          recco_game_id: 2,
          note: 'You might like this'
        };

        return supertest(app)
          .post('/api/user-reccos')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newUserRecco)
          .expect(201)
          .expect(res => {
            expect(res.body.game_id).to.eql(newUserRecco.game_id)
            expect(res.body.uid).to.eql(newUserRecco.uid)
            expect(res.body.recco_game_id).to.eql(newUserRecco.recco_game_id)
            expect(res.body.note).to.eql(newUserRecco.note)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/user-reccos/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/user-reccos/${res.body.id}`)
              .expect(res.body)
          )
      });

      const requiredFields = [ 'uid', 'game_id', 'recco_game_id' ];

      requiredFields.forEach(field => {
          const newUserRecco = {
              uid: 1,
              game_id: 1,
              recco_game_id: 2
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newUserRecco[field]

          return supertest(app)
            .post('/api/user-reccos')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newUserRecco)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });

      it('removes XSS attack content from response', () => {
        const { maliciousUserRecco, expectedUserRecco } = makeMaliciousUserReccos();
        return supertest(app)
          .post(`/api/user-reccos`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(maliciousUserRecco)
          .expect(201)
          .expect(res => {
              expect(res.body.note).to.eql(expectedUserRecco.note)
          })
      });
  });
  });

  describe(`DELETE /api/user-reccos/:recco_id`, () => {
    context(`Given no user reccos`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert user reccos', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
      });

      it(`responds with 404`, () => {
        const recco_id = 123;
        return supertest(app)
          .delete(`/api/user-reccos/${recco_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User recco doesn't exist` } })
      })
    });

    context('Given there are user reccos in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserReccos = makeUserReccosArray();

        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }
  
        beforeEach('insert user reccos', () => {
          return db
            .into('games')
            .insert(testGames)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            })
            .then(() => {
              return db 
                .into('user_reccos')
                .insert(testUserReccos)
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

        it('responds with 204 and removes the recco', () => {
          const idToRemove = 2
          const expectedUserRecco = testUserReccos.filter(sess => sess.id !== idToRemove)
          return supertest(app)
            .delete(`/api/user-reccos/${idToRemove}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/user-reccos`)
                .expect(expectedUserRecco)
            )
        });
    });
  });

  describe(`PATCH /api/user-reccos/:recco_id`, () => {
    context(`Given no user reccos`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert user reccos', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
      });

      it(`responds with 404`, () => {
        const recco_id = 123;
        return supertest(app)
          .patch(`/api/user-reccos/${recco_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User recco doesn't exist` } })
      })
    });

    context('Given there are user reccos in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserReccos = makeUserReccosArray();

        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }
  
        beforeEach('insert user reccos', () => {
          return db
            .into('games')
            .insert(testGames)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            })
            .then(() => {
              return db 
                .into('user_reccos')
                .insert(testUserReccos)
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
        const updateUserRecco = {
          uid: 1,
          game_id: 1,
          recco_game_id: 2,
          note: 'New note'
        };
        const expectedUserRecco = {
          ...testUserReccos[idToUpdate - 1],
          ...updateUserRecco
        };
        return supertest(app)
          .patch(`/api/user-reccos/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(updateUserRecco)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-reccos/${idToUpdate}`)
              .expect(expectedUserRecco)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-reccos/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID, game ID, and recco game ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserRecco = {
            uid: 3,
            recco_game_id: 4,
            note: 'New recco',
        };
        const expectedUserRecco = {
          ...testUserReccos[idToUpdate - 1],
          ...updateUserRecco
        };

        return supertest(app)
          .patch(`/api/user-reccos/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({
            ...updateUserRecco,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-reccos/${idToUpdate}`)
              .expect(expectedUserRecco)
          )
      });
    });
    });
});