const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserBadgesCatArray } = require('./user-badges-cat.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeCatBadgesArray } = require('./badges-cat.fixtures');

describe('User Category Badges Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, badges_cat, user_badges_cat RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, badges_cat, user_badges_cat RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-badges-cat`, () => {
    context(`Given no user category badges`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-badges-cat')
          .expect(200, [])
      })
    });

    context('Given there are user category badges in the database', () => {
      const testUsers = makeUsersArray();
      const testCatBadges = makeCatBadgesArray();
      const testUserCatBadges = makeUserBadgesCatArray();

      beforeEach('insert user category badges', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('badges_cat')
                    .insert(testCatBadges)
            })
            .then(() => {
                return db
                    .into('user_badges_cat')
                    .insert(testUserCatBadges)
            })
      });

      it('responds with 200 and all of the user category badges', () => {
        return supertest(app)
          .get('/api/user-badges-cat')
          .expect(200, testUserCatBadges)
        });
    });
  });

  describe(`GET /api/user-badges-cat/:badge_id`, () => {
    context(`Given no user category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .get(`/api/user-badges-cat/${badge_id}`)
          .expect(404, { error: { message: `User category badge doesn't exist` } })
      });
    });

    context('Given there are badges in the database', () => {
        const testUsers = makeUsersArray();
        const testCatBadges = makeCatBadgesArray();
        const testUserCatBadges = makeUserBadgesCatArray();

        beforeEach('insert user category badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_cat')
                        .insert(testCatBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_cat')
                        .insert(testUserCatBadges)
                })
        });

      it('responds with 200 and the specified badge', () => {
        const badge_id = 2
        const expectedUserCatBadge = testUserCatBadges[badge_id - 1]
        return supertest(app)
          .get(`/api/user-badges-cat/${badge_id}`)
          .expect(200, expectedUserCatBadge)
      });
    });
  });

  describe(`POST /api/user-badges-cat`, () => {

    context('Given there are user category badges in the database', () => {
      const testUsers = makeUsersArray();
      const testCatBadges = makeCatBadgesArray();

      beforeEach('insert user category badges', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('badges_cat')
                    .insert(testCatBadges)
            })
      });

      it(`creates a badge, responding with 201 and the new badge`, () => {
        const newUserCatBadge = {
          uid: 4,
          badge_id: 3
        };

        return supertest(app)
          .post('/api/user-badges-cat')
          .send(newUserCatBadge)
          .expect(201)
          .expect(res => {
            expect(res.body.uid).to.eql(newUserCatBadge.uid)
            expect(res.body.badge_id).to.eql(newUserCatBadge.badge_id)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/user-badges-cat/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-cat/${res.body.id}`)
              .expect(res.body)
          )
      });

      const requiredFields = [ 'uid', 'badge_id' ];

      requiredFields.forEach(field => {
          const newUserCatBadge = {
              uid: 3,
              badge_id: 4
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newUserCatBadge[field]

          return supertest(app)
            .post('/api/user-badges-cat')
            .send(newUserCatBadge)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });
  });
  });

  describe(`DELETE /api/user-badges-cat/:badge_id`, () => {
    context(`Given no user category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/user-badges-cat/${badge_id}`)
          .expect(404, { error: { message: `User category badge doesn't exist` } })
      })
    });

    context('Given there are user category badges in the database', () => {
        const testUsers = makeUsersArray();
        const testCatBadges = makeCatBadgesArray();
        const testUserCatBadges = makeUserBadgesCatArray();

        beforeEach('insert user category badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_cat')
                        .insert(testCatBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_cat')
                        .insert(testUserCatBadges)
                })
        });

      it('responds with 204 and removes the badge', () => {
        const idToRemove = 2
        const expectedUserCatBadge = testUserCatBadges.filter(badge => badge.id !== idToRemove)
        return supertest(app)
          .delete(`/api/user-badges-cat/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-cat`)
              .expect(expectedUserCatBadge)
          )
      });
    });
  });

  describe(`PATCH /api/user-badges-cat/:badge_id`, () => {
    context(`Given no user category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/user-badges-cat/${badge_id}`)
          .expect(404, { error: { message: `User category badge doesn't exist` } })
      })
    });

    context('Given there are user category badges in the database', () => {
        const testUsers = makeUsersArray();
        const testCatBadges = makeCatBadgesArray();
        const testUserCatBadges = makeUserBadgesCatArray();

        beforeEach('insert user category badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_cat')
                        .insert(testCatBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_cat')
                        .insert(testUserCatBadges)
                })
        });

      it('responds with 204 and updates the badge', () => {
        const idToUpdate = 2;
        const updateUserCatBadge = {
          uid: 3,
          badge_id: 4
        };
        const expectedUserCatBadge = {
          ...testUserCatBadges[idToUpdate - 1],
          ...updateUserCatBadge
        };
        return supertest(app)
          .patch(`/api/user-badges-cat/${idToUpdate}`)
          .send(updateUserCatBadge)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-cat/${idToUpdate}`)
              .expect(expectedUserCatBadge)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-badges-cat/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID and badge ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserCatBadge = {
            badge_id: 5
        };
        const expectedUserCatBadge = {
          ...testUserCatBadges[idToUpdate - 1],
          ...updateUserCatBadge
        };

        return supertest(app)
          .patch(`/api/user-badges-cat/${idToUpdate}`)
          .send({
            ...updateUserCatBadge,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-cat/${idToUpdate}`)
              .expect(expectedUserCatBadge)
          )
      });
    });
    });
});