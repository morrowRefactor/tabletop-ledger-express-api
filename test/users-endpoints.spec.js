const knex = require('knex');
const app = require('../src/app');
const { makeUsersArray, makeUsersSansPassArray, makeMaliciousUser } = require('./users.fixtures');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');

describe('Users Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

  describe(`GET /api/users`, () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, [])
      })
    });

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();
      const usersSansPassword = makeUsersSansPassArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      });

      it('responds with 200 and all of the users', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, usersSansPassword)
        });
    });

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = makeMaliciousUser();

      beforeEach('insert malicious user', () => {
        return db
          .into('users')
          .insert(maliciousUser)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedUser.name)
            expect(res.body[0].about).to.eql(expectedUser.about)
            expect(res.body[0].joined_date).to.eql(expectedUser.joined_date)
          })
      });
    });
  });

  describe(`GET /api/users/:uid`, () => {
    context(`Given no user`, () => {
      it(`responds with 404`, () => {
        const uid = 123;
        return supertest(app)
          .get(`/api/users/${uid}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      });
    });

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();
      const usersSansPassword = makeUsersSansPassArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      });

      it('responds with 200 and the specified user', () => {
        const uid = 2
        const expectedUser = usersSansPassword[uid - 1]
        return supertest(app)
          .get(`/api/users/${uid}`)
          .expect(200, expectedUser)
      });
    });

    context(`Given an XSS attack content`, () => {
      const { maliciousUser, expectedUser } = makeMaliciousUser();

      beforeEach('insert malicious user', () => {
        return db
          .into('users')
          .insert(maliciousUser)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users/${maliciousUser.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedUser.name)
            expect(res.body.about).to.eql(expectedUser.about)
            expect(res.body.joined_date).to.eql(expectedUser.joined_date)
          })
      });
    });
  });

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      const testUsers = makeUsersArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      });
      
      const requiredFields = [ 'name', 'password' ];

      requiredFields.forEach(field => {
          const newUser = {
              name: 'test user',
              about: 'test about',
              password: 'cywyb3Y6Qxg',
              joined_date: new Date('2020-03-22T16:28:32.615Z').toISOString('en', { timeZone: 'UTC' })
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newUser[field]

          return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          name: 'test user_name',
          password: '1234567'
        };

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` })
      });

      it(`responds 400 'Password must be less than 72 characters' when empty password`, () => {
        const userShortPassword = {
          name: 'test user_name',
          password: '*'.repeat(73)
        };

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be less than 72 characters` })
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userShortPassword = {
          name: 'test user_name',
          password: ' 1Aa!2Bb@'
        };

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userShortPassword = {
          name: 'test user_name',
          password: '1Aa!2Bb@ '
        };

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          name: 'test user_name',
          password: '11AAaabb'
        };

        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
      });

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const testUsers = makeUsersArray();
        const dupeUser = testUsers[0];
        const duplicateUser = {
          name: dupeUser.name,
          password: '11AAaabb!!'
        };

        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      });
    });

    context(`Removes xss attack content`, () => {
      it('removes XSS attack content from response', () => {
        const { maliciousUser, expectedUser } = makeMaliciousUser();
        return supertest(app)
          .post(`/api/users`)
          .send(maliciousUser)
          .expect(201)
          .expect(res => {
              expect(res.body.name).to.eql(expectedUser.name)
              expect(res.body.about).to.eql(expectedUser.about)
              expect(res.body).to.not.have.property('password')
              expect(res.body.joined_date).to.eql(expectedUser.joined_date)
          })
      });
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          name: 'test user_name',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.name).to.eql(newUser.name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.name).to.eql(newUser.name)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    });
  });

  describe(`DELETE /api/users/:uid`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const uid = 123
        return supertest(app)
          .delete(`/api/users/${uid}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    });

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();
      const usersSansPassword = makeUsersSansPassArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      });

      it('responds with 204 and removes the user', () => {
        const idToRemove = 2
        const expectedUser = usersSansPassword.filter(uid => uid.id !== idToRemove)
        return supertest(app)
          .delete(`/api/users/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users`)
              .expect(expectedUser)
          )
      });
    });
  });

  describe(`PATCH /api/users/:uid`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const uid = 123
        return supertest(app)
          .delete(`/api/users/${uid}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    });

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();
      const usersSansPassword = makeUsersSansPassArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      });

      it('responds with 204 and updates the user', () => {
        const idToUpdate = 2;
        const updateUser = {
          name: 'updated name',
          about: 'new test about'
        };
        const expectedUser = {
          ...usersSansPassword[idToUpdate - 1],
          ...updateUser
        };
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .send(updateUser)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .expect(expectedUser)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a name, password, or about section`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUser = {
          name: 'updated name',
        };
        const expectedUser = {
          ...usersSansPassword[idToUpdate - 1],
          ...updateUser
        };

        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .send({
            ...updateUser,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .expect(expectedUser)
          )
      });
    });
    });
});