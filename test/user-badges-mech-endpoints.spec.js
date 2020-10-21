const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeUserBadgesMechArray } = require('./user-badges-mech.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeMechBadgesArray } = require('./badges-mech.fixtures');

describe('User Mech Badges Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, badges_mech, user_badges_mech RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, badges_mech, user_badges_mech RESTART IDENTITY CASCADE'));

  describe(`GET /api/user-badges-mech`, () => {
    context(`Given no user mech badges`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/user-badges-mech')
          .expect(200, [])
      })
    });

    context('Given there are user mech badges in the database', () => {
      const testUsers = makeUsersArray();
      const testMechBadges = makeMechBadgesArray();
      const testUserMechBadges = makeUserBadgesMechArray();

      beforeEach('insert user mech badges', () => {
        return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                    .into('badges_mech')
                    .insert(testMechBadges)
            })
            .then(() => {
                return db
                    .into('user_badges_mech')
                    .insert(testUserMechBadges)
            })
      });

      it('responds with 200 and all of the user mech badges', () => {
        return supertest(app)
          .get('/api/user-badges-mech')
          .expect(200, testUserMechBadges)
        });
    });
  });

  describe(`GET /api/user-badges-mech/:badge_id`, () => {
    context(`Given no user mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .get(`/api/user-badges-mech/${badge_id}`)
          .expect(404, { error: { message: `User mech badge doesn't exist` } })
      });
    });

    context('Given there are badges in the database', () => {
        const testUsers = makeUsersArray();
        const testMechBadges = makeMechBadgesArray();
        const testUserMechBadges = makeUserBadgesMechArray();

        beforeEach('insert user mech badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_mech')
                        .insert(testMechBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_mech')
                        .insert(testUserMechBadges)
                })
        });

      it('responds with 200 and the specified badge', () => {
        const badge_id = 2
        const expectedUserMechBadge = testUserMechBadges[badge_id - 1]
        return supertest(app)
          .get(`/api/user-badges-mech/${badge_id}`)
          .expect(200, expectedUserMechBadge)
      });
    });
  });

  describe(`POST /api/user-badges-mech`, () => {

    it(`creates a badge, responding with 201 and the new badge`, () => {
      const newUserMechBadge = {
        uid: 4,
        badge_id: 3
      };

      return supertest(app)
        .post('/api/user-badges-mech')
        .send(newUserMechBadge)
        .expect(201)
        .expect(res => {
          expect(res.body.uid).to.eql(newUserMechBadge.uid)
          expect(res.body.badge_id).to.eql(newUserMechBadge.badge_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/user-badges-mech/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/user-badges-mech/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'uid', 'badge_id' ];

    requiredFields.forEach(field => {
        const newUserMechBadge = {
            uid: 3,
            badge_id: 4
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserMechBadge[field]

        return supertest(app)
          .post('/api/user-badges-mech')
          .send(newUserMechBadge)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/user-badges-mech/:badge_id`, () => {
    context(`Given no user mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/user-badges-mech/${badge_id}`)
          .expect(404, { error: { message: `User mech badge doesn't exist` } })
      })
    });

    context('Given there are user mech badges in the database', () => {
        const testUsers = makeUsersArray();
        const testMechBadges = makeMechBadgesArray();
        const testUserMechBadges = makeUserBadgesMechArray();

        beforeEach('insert user mech badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_mech')
                        .insert(testMechBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_mech')
                        .insert(testUserMechBadges)
                })
        });

      it('responds with 204 and removes the badge', () => {
        const idToRemove = 2
        const expectedUserMechBadge = testUserMechBadges.filter(badge => badge.id !== idToRemove)
        return supertest(app)
          .delete(`/api/user-badges-mech/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-mech`)
              .expect(expectedUserMechBadge)
          )
      });
    });
  });

  describe(`PATCH /api/user-badges-mech/:badge_id`, () => {
    context(`Given no user mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/user-badges-mech/${badge_id}`)
          .expect(404, { error: { message: `User mech badge doesn't exist` } })
      })
    });

    context('Given there are user mech badges in the database', () => {
        const testUsers = makeUsersArray();
        const testMechBadges = makeMechBadgesArray();
        const testUserMechBadges = makeUserBadgesMechArray();

        beforeEach('insert user mech badges', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('badges_mech')
                        .insert(testMechBadges)
                })
                .then(() => {
                    return db
                        .into('user_badges_mech')
                        .insert(testUserMechBadges)
                })
        });

      it('responds with 204 and updates the badge', () => {
        const idToUpdate = 2;
        const updateUserMechBadge = {
          uid: 3,
          badge_id: 4
        };
        const expectedUserMechBadge = {
          ...testUserMechBadges[idToUpdate - 1],
          ...updateUserMechBadge
        };
        return supertest(app)
          .patch(`/api/user-badges-mech/${idToUpdate}`)
          .send(updateUserMechBadge)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-mech/${idToUpdate}`)
              .expect(expectedUserMechBadge)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/user-badges-mech/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID and badge ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUserMechBadge = {
            badge_id: 5
        };
        const expectedUserMechBadge = {
          ...testUserMechBadges[idToUpdate - 1],
          ...updateUserMechBadge
        };

        return supertest(app)
          .patch(`/api/user-badges-mech/${idToUpdate}`)
          .send({
            ...updateUserMechBadge,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/user-badges-mech/${idToUpdate}`)
              .expect(expectedUserMechBadge)
          )
      });
    });
    });
});