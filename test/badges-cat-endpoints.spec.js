const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeCatBadgesArray, makeMaliciousCatBadges } = require('./badges-cat.fixtures');

describe('Category Badges Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE badges_cat RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE badges_cat RESTART IDENTITY CASCADE'));

  describe(`GET /api/badges-cat`, () => {
    context(`Given no category badges`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/badges-cat')
          .expect(200, [])
      })
    });

    context('Given there are category badges in the database', () => {
      const testCatBadges = makeCatBadgesArray();

      beforeEach('insert category badges', () => {
        return db
            .into('badges_cat')
            .insert(testCatBadges)
      });

      it('responds with 200 and all of the category badges', () => {
        return supertest(app)
          .get('/api/badges-cat')
          .expect(200, testCatBadges)
        });
    });

    context(`Given an XSS attack badge`, () => {
      const { maliciousCatBadge, expectedCatBadge } = makeMaliciousCatBadges();

      beforeEach('insert malicious bagde', () => {
        return db
            .into('badges_cat')
            .insert(maliciousCatBadge)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badges-cat`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedCatBadge.name)
          })
      });
    });
  });

  describe(`GET /api/badges-cat/:badge_id`, () => {
    context(`Given no category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .get(`/api/badges-cat/${badge_id}`)
          .expect(404, { error: { message: `Category badge doesn't exist` } })
      });
    });

    context('Given there are badges in the database', () => {
        const testCatBadges = makeCatBadgesArray();
  
        beforeEach('insert badges', () => {
          return db
            .into('badges_cat')
            .insert(testCatBadges)
        });

      it('responds with 200 and the specified badge', () => {
        const badge_id = 2
        const expectedCatBadge = testCatBadges[badge_id - 1]
        return supertest(app)
          .get(`/api/badges-cat/${badge_id}`)
          .expect(200, expectedCatBadge)
      });
    });

    context(`Given an XSS attack content`, () => {
        const { maliciousCatBadge, expectedCatBadge } = makeMaliciousCatBadges();
  
        beforeEach('insert malicious badge', () => {
          return db
            .into('badges_cat')
            .insert(maliciousCatBadge)
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/badges-cat/${maliciousCatBadge.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedCatBadge.name)
          })
      });
    });
  });

  describe(`POST /api/badges-cat`, () => {

    it(`creates a badge, responding with 201 and the new badge`, () => {
      const newCatBadge = {
        cat_id: 1234,
        name: 'New badge'
      };

      return supertest(app)
        .post('/api/badges-cat')
        .send(newCatBadge)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newCatBadge.name)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/badges-cat/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/badges-cat/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'name', 'cat_id' ];

    requiredFields.forEach(field => {
        const newCatBadge = {
            cat_id: 1234,
            name: 'new badge'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newCatBadge[field]

        return supertest(app)
          .post('/api/badges-cat')
          .send(newCatBadge)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousCatBadge, expectedCatBadge } = makeMaliciousCatBadges();
      return supertest(app)
        .post(`/api/badges-cat`)
        .send(maliciousCatBadge)
        .expect(201)
        .expect(res => {
            expect(res.body.name).to.eql(expectedCatBadge.name)
        })
    });
  });

  describe(`DELETE /api/badges-cat/:badge_id`, () => {
    context(`Given no category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/badges-cat/${badge_id}`)
          .expect(404, { error: { message: `Category badge doesn't exist` } })
      })
    });

    context('Given there are category badges in the database', () => {
        const testCatBadges = makeCatBadgesArray();
  
        beforeEach('insert badge', () => {
          return db
            .into('badges_cat')
            .insert(testCatBadges)
        });

      it('responds with 204 and removes the badge', () => {
        const idToRemove = 2
        const expectedCatBadge = testCatBadges.filter(badge => badge.id !== idToRemove)
        return supertest(app)
          .delete(`/api/badges-cat/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-cat`)
              .expect(expectedCatBadge)
          )
      });
    });
  });

  describe(`PATCH /api/badges-cat/:badge_id`, () => {
    context(`Given no category badges`, () => {
      it(`responds with 404`, () => {
        const badge_id = 123;
        return supertest(app)
          .delete(`/api/badges-cat/${badge_id}`)
          .expect(404, { error: { message: `Category badge doesn't exist` } })
      })
    });

    context('Given there are category badges in the database', () => {
        const testCatBadges = makeCatBadgesArray();
  
        beforeEach('insert bagde', () => {
          return db
            .into('badges_cat')
            .insert(testCatBadges)
        });

      it('responds with 204 and updates the badge', () => {
        const idToUpdate = 2;
        const updateCatBadge = {
          cat_id: 1234,
          name: 'new badge name'
        };
        const expectedCatBadge = {
          ...testCatBadges[idToUpdate - 1],
          ...updateCatBadge
        };
        return supertest(app)
          .patch(`/api/badges-cat/${idToUpdate}`)
          .send(updateCatBadge)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-cat/${idToUpdate}`)
              .expect(expectedCatBadge)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/badges-cat/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a badge name and category id`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateCatBadge = {
            cat_id: 1234,
            name: 'new badge name'
        };
        const expectedCatBadge = {
          ...testCatBadges[idToUpdate - 1],
          ...updateCatBadge
        };

        return supertest(app)
          .patch(`/api/badges-cat/${idToUpdate}`)
          .send({
            ...updateCatBadge,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/badges-cat/${idToUpdate}`)
              .expect(expectedCatBadge)
          )
      });
    });
    });
});