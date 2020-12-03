const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserStandingsArray } = require('./user-standings.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

describe('User Standings Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, user_standings RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, user_standings RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-standings`, () => {
    context(`Given no user standings`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-standings')
          .expect(200, [])
      })
    });

    context('Given there are user standings in the database', () => {
      const testUsers = makeUsersArray();
      const testUserStandings = makeUserStandingsArray();

      beforeEach('insert user standings', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('user_standings')
                    .insert(testUserStandings)
            })
      });

      it('responds with 200 and all of the user standings', () => {
        return supertest(app)
          .get('/api/user-standings')
          .expect(200, testUserStandings)
        });
    });
  });

  describe(`GET /api/user-standings/:stand_id`, () => {
    context(`Given no user standings`, () => {
      it(`responds with 404`, () => {
        const stand_id = 123;
        return supertest(app)
          .get(`/api/user-standings/${stand_id}`)
          .expect(404, { error: { message: `User standing doesn't exist` } })
      });
    });

    context('Given there are standings in the database', () => {
        const testUsers = makeUsersArray();
        const testUserStandings = makeUserStandingsArray();

        beforeEach('insert user standings', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('user_standings')
                        .insert(testUserStandings)
                })
        });

      it('responds with 200 and the specified user standings', () => {
        const stand_id = 2
        const expectedUserStandings = testUserStandings[stand_id - 1]
        return supertest(app)
          .get(`/api/user-standings/${stand_id}`)
          .expect(200, expectedUserStandings)
      });
    });
  });

  describe(`POST /api/user-standings`, () => {

    context('Given there are user standings in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert users', () => {
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
      
      it(`creates a user standing, responding with 201 and the new user standing`, () => {    
        const newUserStandings = {
          uid: 1,
          wins: 5,
          losses: 2,
          sessions: 7
        };

        return supertest(app)
          .post('/api/user-standings')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newUserStandings)
          .expect(201)
          .expect(res => {
            expect(res.body.uid).to.eql(newUserStandings.uid)
            expect(res.body.wins).to.eql(newUserStandings.wins)
            expect(res.body.losses).to.eql(newUserStandings.losses)
            expect(res.body.sessions).to.eql(newUserStandings.sessions)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/user-standings/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/user-standings/${res.body.id}`)
              .expect(res.body)
          )
      });
      
      const requiredFields = [ 'uid', 'wins', 'losses', 'sessions' ];

      requiredFields.forEach(field => {
          const newUserStandings = {
              uid: 4,
              wins: 5,
              losses: 2,
              sessions: 7
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newUserStandings[field]

          return supertest(app)
            .post('/api/user-standings')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newUserStandings)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });
  });
  });

  describe(`DELETE /api/user-standings/:stand_id`, () => {
    context(`Given no user standings`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert users', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
      });

      it(`responds with 404`, () => {
        const stand_id = 123;
        return supertest(app)
          .delete(`/api/user-standings/${stand_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User standing doesn't exist` } })
      })
    });

    context('Given there are user standings in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testUserStandings = makeUserStandingsArray();

        function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
          const token = jwt.sign({ user_id: user.id }, secret, {
            subject: user.name,
            algorithm: 'HS256',
          });
  
          return `Bearer ${token}`
        }

        beforeEach('insert users', () => {
          return db
            .into('games')
            .insert(testGames)
            .then(() => {
              helpers.seedUsers(db, testUsers)
            })
            .then(() => {
              return db
                  .into('user_standings')
                  .insert(testUserStandings)
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

        it('responds with 204 and removes the user standings', () => {
          const idToRemove = 2
          const expectedUserStandings = testUserStandings.filter(stand => stand.id !== idToRemove)
          return supertest(app)
            .delete(`/api/user-standings/${idToRemove}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/user-standings`)
                .expect(expectedUserStandings)
            )
        });
    });
  });

  describe(`PATCH /api/user-standings/:stand_id`, () => {
    context(`Given no user standings`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert users', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
      });

      it(`responds with 404`, () => {
        const stand_id = 123;
        return supertest(app)
          .patch(`/api/user-standings/${stand_id}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `User standing doesn't exist` } })
      })
    });

    context('Given there are user standings in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testUserStandings = makeUserStandingsArray();

      function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
        const token = jwt.sign({ user_id: user.id }, secret, {
          subject: user.name,
          algorithm: 'HS256',
        });

        return `Bearer ${token}`
      }

      beforeEach('insert users', () => {
        return db
          .into('games')
          .insert(testGames)
          .then(() => {
            helpers.seedUsers(db, testUsers)
          })
          .then(() => {
            return db
                .into('user_standings')
                .insert(testUserStandings)
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

      it('responds with 204 and updates the user standings', () => {
        const idToUpdate = 2;
        const updateUserStandings = {
          uid: 4,
          wins: 4,
          losses: 4,
          sessions: 8
        };
        const expectedUserStandings = {
          ...testUserStandings[idToUpdate - 1],
          ...updateUserStandings
        };
        return supertest(app)
          .patch(`/api/user-standings/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(updateUserStandings)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-standings/${idToUpdate}`)
              .expect(expectedUserStandings)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-standings/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID, wins, losses, and sessions`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserStandings = {
            wins: 6,
            losses: 6,
            sessions: 12
        };
        const expectedUserStandings = {
          ...testUserStandings[idToUpdate - 1],
          ...updateUserStandings
        };

        return supertest(app)
          .patch(`/api/user-standings/${idToUpdate}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send({
            ...updateUserStandings,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-standings/${idToUpdate}`)
              .expect(expectedUserStandings)
          )
      });
    });
    });
});