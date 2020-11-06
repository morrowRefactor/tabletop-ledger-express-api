const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeCatGamesArray, makeMaliciousCatGames } = require('./games-cat.fixtures');

describe('Games Category Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE games_cat RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE games_cat RESTART IDENTITY CASCADE'));

  describe(`GET /api/games-cat`, () => {
    context(`Given no game categories`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/games-cat')
          .expect(200, [])
      })
    });

    context('Given there are game categories in the database', () => {
      const testCatGames = makeCatGamesArray();

      beforeEach('insert game categories', () => {
        return db
            .into('games_cat')
            .insert(testCatGames)
      });

      it('responds with 200 and all of the game categories', () => {
        return supertest(app)
          .get('/api/games-cat')
          .expect(200, testCatGames)
        });
    });

    context(`Given an XSS attack`, () => {
      const { maliciousCatGame, expectedCatGame } = makeMaliciousCatGames();

      beforeEach('insert malicious game category', () => {
        return db
            .into('games_cat')
            .insert(maliciousCatGame)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games-cat`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedCatGame.name)
            expect(res.body[0].cat_id).to.eql(expectedCatGame.cat_id)
          })
      });
    });
  });

  describe(`GET /api/games-cat/:cat_id`, () => {
    context(`Given no game categories`, () => {
      it(`responds with 404`, () => {
        const cat_id = 123;
        return supertest(app)
          .get(`/api/games-cat/${cat_id}`)
          .expect(404, { error: { message: `Game category doesn't exist` } })
      });
    });

    context('Given there are categories in the database', () => {
        const testCatGames = makeCatGamesArray();
  
        beforeEach('insert categories', () => {
          return db
            .into('games_cat')
            .insert(testCatGames)
        });

      it('responds with 200 and the specified category', () => {
        const cat_id = 123;
        const expectedCatGame = testCatGames[0];
        return supertest(app)
          .get(`/api/games-cat/${cat_id}`)
          .expect(200, expectedCatGame)
      });
    });

    context(`Given an XSS attack content`, () => {
        const { maliciousCatGame, expectedCatGame } = makeMaliciousCatGames();
  
        beforeEach('insert malicious category', () => {
          return db
            .into('games_cat')
            .insert(maliciousCatGame)
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games-cat/${maliciousCatGame.cat_id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedCatGame.name)
            expect(res.body.cat_id).to.eql(expectedCatGame.cat_id)
          })
      });
    });
  });

  describe(`POST /api/games-cat`, () => {

    it(`creates a category, responding with 201 and the new category`, () => {
      const newCatGame = {
        name: 'New badge',
        cat_id: 567
      };

      return supertest(app)
        .post('/api/games-cat')
        .send(newCatGame)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newCatGame.name)
          expect(res.body.cat_id).to.eql(newCatGame.cat_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/games-cat/${res.body.cat_id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/games-cat/${res.body.cat_id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'name', 'cat_id' ];

    requiredFields.forEach(field => {
        const newCatGame = {
            name: 'new badge',
            cat_id: 567
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newCatGame[field]

        return supertest(app)
          .post('/api/games-cat')
          .send(newCatGame)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousCatGame, expectedCatGame } = makeMaliciousCatGames();
      return supertest(app)
        .post(`/api/games-cat`)
        .send(maliciousCatGame)
        .expect(201)
        .expect(res => {
            expect(res.body.name).to.eql(expectedCatGame.name)
            expect(res.body.cat_id).to.eql(expectedCatGame.cat_id)
        })
    });
  });

  describe(`DELETE /api/games-cat/:cat_id`, () => {
    context(`Given no categories`, () => {
      it(`responds with 404`, () => {
        const cat_id = 123;
        return supertest(app)
          .delete(`/api/games-cat/${cat_id}`)
          .expect(404, { error: { message: `Game category doesn't exist` } })
      })
    });

    context('Given there are game categories in the database', () => {
        const testCatGames = makeCatGamesArray();
  
        beforeEach('insert category', () => {
          return db
            .into('games_cat')
            .insert(testCatGames)
        });

      it('responds with 204 and removes the category', () => {
        const idToRemove = 2;
        const expectedCatGame = testCatGames.filter(game => game.id !== idToRemove)
        return supertest(app)
          .delete(`/api/games-cat/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat`)
              .expect(expectedCatGame)
          )
      });
    });
  });

  describe(`PATCH /api/games-cat/:cat_id`, () => {
    context(`Given no game categories`, () => {
      it(`responds with 404`, () => {
        const cat_id = 123;
        return supertest(app)
          .delete(`/api/games-cat/${cat_id}`)
          .expect(404, { error: { message: `Game category doesn't exist` } })
      })
    });

    context('Given there are game categories in the database', () => {
        const testCatGames = makeCatGamesArray();
  
        beforeEach('insert category', () => {
          return db
            .into('games_cat')
            .insert(testCatGames)
        });

      it('responds with 204 and updates the category', () => {
        const idToUpdate = 2;
        const updateCatGame = {
          name: 'new badge name',
          cat_id: 567
        };
        const expectedCatGame = {
          ...testCatGames[idToUpdate - 1],
          ...updateCatGame
        };
        return supertest(app)
          .patch(`/api/games-cat/${idToUpdate}`)
          .send(updateCatGame)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat/${idToUpdate}`)
              .expect(expectedCatGame)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/games-cat/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a category name and BGG ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateCatGame = {
            name: 'new badge name',
            cat_id: 567
        };
        const expectedCatGame = {
          ...testCatGames[idToUpdate - 1],
          ...updateCatGame
        };

        return supertest(app)
          .patch(`/api/games-cat/${idToUpdate}`)
          .send({
            ...updateCatGame,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat/${idToUpdate}`)
              .expect(expectedCatGame)
          )
      });
    });
    });
});