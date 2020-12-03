const knex = require('knex');
const app = require('../src/app');
const { makeUserGamesArray, makeMaliciousUserGames } = require('./user-games.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');

describe('Protected endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, user_games RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, user_games RESTART IDENTITY CASCADE'));

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

  const protectedEndpoints = [
    {
      name: 'GET /api/user-games',
      path: '/api/user-games',
      method: supertest(app).get,
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})