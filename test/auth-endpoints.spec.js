const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { makeUsersArray, seedUsers } = require('./users.fixtures');

describe('Auth Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

  describe(`POST /api/auth/login`, () => {
    const testUsers = makeUsersArray();
    const testUser = testUsers[0];

    beforeEach('insert users', () => 
      seedUsers(
        db,
        testUsers
      )
    )
    
    const requiredFields = ['name', 'password']

    requiredFields.forEach(field => {
      
      const loginAttemptBody = {
        name: testUser.name,
        password: testUser.password,
      }
      
      it(`responds with 400 required error when '${field}' is missing`, () => {
          delete loginAttemptBody[field]

          return supertest(app)
            .post('/api/auth/login')
            .send(loginAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
    })
    
    it(`responds 400 'invalid name or password' when bad name`, () => {
      const userInvalidUser = { name: 'user-not', password: 'existy' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect name or password` })
    })
    
    it(`responds 400 'invalid name or password' when bad password`, () => {
      const userInvalidPass = { name: testUser.name, password: 'incorrect' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect name or password` })
    })
    
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        name: testUser.name,
        password: testUser.password,
      }
      
      const expectedToken = jwt.sign(
        { id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.name,
          algorithm: 'HS256',
        }
      );
      
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })
})