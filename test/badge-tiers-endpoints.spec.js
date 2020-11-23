const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeBadgeTiersArray, makeMaliciousBadgeTiers } = require('./badge-tiers.fixtures');

describe('Badge Tiers Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE badge_tiers RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE badge_tiers RESTART IDENTITY CASCADE'));

  describe(`GET /api/badge-tiers`, () => {
    context(`Given no badge tiers`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/badge-tiers')
          .expect(200, [])
      })
    });

    context('Given there are badge tiers in the database', () => {
      const testBadgeTiers = makeBadgeTiersArray();

      beforeEach('insert badge tiers', () => {
        return db
            .into('badge_tiers')
            .insert(testBadgeTiers)
      });

      it('responds with 200 and all of the badge tiers', () => {
        return supertest(app)
          .get('/api/badge-tiers')
          .expect(200, testBadgeTiers)
        });
    });

    context(`Given an XSS attack badge`, () => {
      const { maliciousBadgeTier, expectedBadgeTier } = makeMaliciousBadgeTiers();

      beforeEach('insert malicious badge tier', () => {
        return db
            .into('badge_tiers')
            .insert(maliciousBadgeTier)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badge-tiers`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedBadgeTier.name)
          })
      });
    });
  });

  describe(`GET /api/badge-tiers/:tier_id`, () => {
    context(`Given no badge tiers`, () => {
      it(`responds with 404`, () => {
        const tier_id = 123;
        return supertest(app)
          .get(`/api/badge-tiers/${tier_id}`)
          .expect(404, { error: { message: `Badge tier doesn't exist` } })
      });
    });

    context('Given there are badge tiers in the database', () => {
        const testBadgeTiers = makeBadgeTiersArray();
  
        beforeEach('insert badge tiers', () => {
          return db
            .into('badge_tiers')
            .insert(testBadgeTiers)
        });

      it('responds with 200 and the specified badge', () => {
        const tier_id = 2
        const expectedBadgeTier = testBadgeTiers[tier_id - 1]
        return supertest(app)
          .get(`/api/badge-tiers/${tier_id}`)
          .expect(200, expectedBadgeTier)
      });
    });

    context(`Given an XSS attack content`, () => {
        const { maliciousBadgeTier, expectedBadgeTier } = makeMaliciousBadgeTiers();
  
        beforeEach('insert malicious badge tier', () => {
          return db
            .into('badge_tiers')
            .insert(maliciousBadgeTier)
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badge-tiers/${maliciousBadgeTier.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedBadgeTier.name)
          })
      });
    });
  });

  describe(`POST /api/badge-tiers`, () => {

    it(`creates a badge tier, responding with 201 and the new badge tier`, () => {
      const newBadgeTier = {
        name: 'New badge'
      };

      return supertest(app)
        .post('/api/badge-tiers')
        .send(newBadgeTier)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newBadgeTier.name)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/badge-tiers/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/badge-tiers/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'name' ];

    requiredFields.forEach(field => {
        const newBadgeTier = {
            name: 'new badge'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newBadgeTier[field]

        return supertest(app)
          .post('/api/badge-tiers')
          .send(newBadgeTier)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousBadgeTier, expectedBadgeTier } = makeMaliciousBadgeTiers();
      return supertest(app)
        .post(`/api/badge-tiers`)
        .send(maliciousBadgeTier)
        .expect(201)
        .expect(res => {
            expect(res.body.name).to.eql(expectedBadgeTier.name)
        })
    });
  });

  describe(`DELETE /api/badge-tiers/:tier_id`, () => {
    context(`Given no badge tiers`, () => {
      it(`responds with 404`, () => {
        const tier_id = 123;
        return supertest(app)
          .delete(`/api/badge-tiers/${tier_id}`)
          .expect(404, { error: { message: `Badge tier doesn't exist` } })
      })
    });

    context('Given there are badge tiers in the database', () => {
        const testBadgeTiers = makeBadgeTiersArray();
  
        beforeEach('insert badge tiers', () => {
          return db
            .into('badge_tiers')
            .insert(testBadgeTiers)
        });

      it('responds with 204 and removes the badge tier', () => {
        const idToRemove = 2
        const expectedBadgeTier = testBadgeTiers.filter(tier => tier.id !== idToRemove)
        return supertest(app)
          .delete(`/api/badge-tiers/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badge-tiers`)
              .expect(expectedBadgeTier)
          )
      });
    });
  });

  describe(`PATCH /api/badge-tiers/:tier_id`, () => {
    context(`Given no badge tiers`, () => {
      it(`responds with 404`, () => {
        const tier_id = 123;
        return supertest(app)
          .delete(`/api/badge-tiers/${tier_id}`)
          .expect(404, { error: { message: `Badge tier doesn't exist` } })
      })
    });

    context('Given there are badge tiers in the database', () => {
        const testBadgeTiers = makeBadgeTiersArray();
  
        beforeEach('insert badge tier', () => {
          return db
            .into('badge_tiers')
            .insert(testBadgeTiers)
        });

      it('responds with 204 and updates the badge tier', () => {
        const idToUpdate = 2;
        const updateBadgeTier = {
          name: 'new badge name'
        };
        const expectedBadgeTier = {
          ...testBadgeTiers[idToUpdate - 1],
          ...updateBadgeTier
        };
        return supertest(app)
          .patch(`/api/badge-tiers/${idToUpdate}`)
          .send(updateBadgeTier)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badge-tiers/${idToUpdate}`)
              .expect(expectedBadgeTier)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/badge-tiers/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a badge tier name`
            }
          })
      });
    });
    });
});