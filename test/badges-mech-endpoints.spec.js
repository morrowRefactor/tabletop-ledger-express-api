const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeMechBadgesArray, makeMaliciousMechBadges } = require('./badges-mech.fixtures');

describe('Mech Badges Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE badges_mech RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE badges_mech RESTART IDENTITY CASCADE'));

  describe(`GET /api/badges-mech`, () => {
    context(`Given no mech badges`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/badges-mech')
          .expect(200, [])
      })
    });

    context('Given there are mech badges in the database', () => {
      const testMechBadges = makeMechBadgesArray();

      beforeEach('insert mech badges', () => {
        return db
            .into('badges_mech')
            .insert(testMechBadges)
      });

      it('responds with 200 and all of the mech badges', () => {
        return supertest(app)
          .get('/api/badges-mech')
          .expect(200, testMechBadges)
        });
    });

    context(`Given an XSS attack badge`, () => {
      const { maliciousMechBadge, expectedMechBadge } = makeMaliciousMechBadges();

      beforeEach('insert malicious bagde', () => {
        return db
            .into('badges_mech')
            .insert(maliciousMechBadge)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badges-mech`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedMechBadge.name)
          })
      });
    });
  });

  describe(`GET /api/badges-mech/:badge_id`, () => {
    context(`Given no mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .get(`/api/badges-mech/${badge_id}`)
          .expect(404, { error: { message: `Mech badge doesn't exist` } })
      });
    });

    context('Given there are badges in the database', () => {
        const testMechBadges = makeMechBadgesArray();
  
        beforeEach('insert badges', () => {
          return db
            .into('badges_mech')
            .insert(testMechBadges)
        });

      it('responds with 200 and the specified badge', () => {
        const badge_id = 2
        const expectedMechBadge = testMechBadges[badge_id - 1]
        return supertest(app)
          .get(`/api/badges-mech/${badge_id}`)
          .expect(200, expectedMechBadge)
      });
    });

    context(`Given an XSS attack content`, () => {
        const { maliciousMechBadge, expectedMechBadge } = makeMaliciousMechBadges();
  
        beforeEach('insert malicious badge', () => {
          return db
            .into('badges_mech')
            .insert(maliciousMechBadge)
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badges-mech/${maliciousMechBadge.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedMechBadge.name)
          })
      });
    });
  });

  describe(`POST /api/badges-mech`, () => {

    it(`creates a badge, responding with 201 and the new badge`, () => {
      const newMechBadge = {
        name: 'New badge'
      };

      return supertest(app)
        .post('/api/badges-mech')
        .send(newMechBadge)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newMechBadge.name)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/badges-mech/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/badges-mech/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'name' ];

    requiredFields.forEach(field => {
        const newMechBadge = {
            name: 'new badge'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMechBadge[field]

        return supertest(app)
          .post('/api/badges-mech')
          .send(newMechBadge)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousMechBadge, expectedMechBadge } = makeMaliciousMechBadges();
      return supertest(app)
        .post(`/api/badges-mech`)
        .send(maliciousMechBadge)
        .expect(201)
        .expect(res => {
            expect(res.body.name).to.eql(expectedMechBadge.name)
        })
    });
  });

  describe(`DELETE /api/badges-mech/:badge_id`, () => {
    context(`Given no mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/badges-mech/${badge_id}`)
          .expect(404, { error: { message: `Mech badge doesn't exist` } })
      })
    });

    context('Given there are mech badges in the database', () => {
        const testMechBadges = makeMechBadgesArray();
  
        beforeEach('insert game tips', () => {
          return db
            .into('badges_mech')
            .insert(testMechBadges)
        });

      it('responds with 204 and removes the badge', () => {
        const idToRemove = 2
        const expectedMechBadge = testMechBadges.filter(badge => badge.id !== idToRemove)
        return supertest(app)
          .delete(`/api/badges-mech/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-mech`)
              .expect(expectedMechBadge)
          )
      });
    });
  });

  describe(`PATCH /api/badges-mech/:badge_id`, () => {
    context(`Given no mech badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/badges-mech/${badge_id}`)
          .expect(404, { error: { message: `Mech badge doesn't exist` } })
      })
    });

    context('Given there are mech badges in the database', () => {
        const testMechBadges = makeMechBadgesArray();
  
        beforeEach('insert bagde', () => {
          return db
            .into('badges_mech')
            .insert(testMechBadges)
        });

      it('responds with 204 and updates the badge', () => {
        const idToUpdate = 2;
        const updateMechBadge = {
          name: 'new badge name'
        };
        const expectedMechBadge = {
          ...testMechBadges[idToUpdate - 1],
          ...updateMechBadge
        };
        return supertest(app)
          .patch(`/api/badges-mech/${idToUpdate}`)
          .send(updateMechBadge)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-mech/${idToUpdate}`)
              .expect(expectedMechBadge)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/badges-mech/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a badge name`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateMechBadge = {
            name: 'new badge name'
        };
        const expectedMechBadge = {
          ...testMechBadges[idToUpdate - 1],
          ...updateMechBadge
        };

        return supertest(app)
          .patch(`/api/badges-mech/${idToUpdate}`)
          .send({
            ...updateMechBadge,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-mech/${idToUpdate}`)
              .expect(expectedMechBadge)
          )
      });
    });
    });
});