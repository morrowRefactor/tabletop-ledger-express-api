const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeCatGameMatchesArray } = require('./games-cat-matches.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const { makeCatGamesArray}  = require('./games-cat.fixtures');

describe('Game Category Matches Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE games, games_cat, games_cat_matches RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE games, games_cat, games_cat_matches RESTART IDENTITY CASCADE'));

  describe(`GET /api/games-cat-matches`, () => {
    context(`Given no game category matches`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/games-cat-matches')
          .expect(200, [])
      })
    });

    context('Given there are game category matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesCat = makeCatGamesArray();
        const testCatGameMatches = makeCatGameMatchesArray();

      beforeEach('insert game category matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('games_cat_matches')
                    .insert(testCatGameMatches)
            })  
      });

      it('responds with 200 and all of the game category matches', () => {
        return supertest(app)
          .get('/api/games-cat-matches')
          .expect(200, testCatGameMatches)
        });
    });
  });

  describe(`GET /api/games-cat-matches/:id`, () => {
    context(`Given no game category matches`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .get(`/api/games-cat-matches/${id}`)
          .expect(404, { error: { message: `Game category match doesn't exist` } })
      });
    });

    context('Given there are game category matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesCat = makeCatGamesArray();
        const testCatGameMatches = makeCatGameMatchesArray();

      beforeEach('insert game category matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('games_cat_matches')
                    .insert(testCatGameMatches)
            })  
      });

      it('responds with 200 and the specified game category match', () => {
        const id = 2;
        const expectedCatGameMatch = testCatGameMatches[id - 1];
        return supertest(app)
          .get(`/api/games-cat-matches/${id}`)
          .expect(200, expectedCatGameMatch)
      });
    });
  });

  describe(`POST /api/games-cat-matches`, () => {
    const testGames = makeGamesArray();
    const testGamesCat = makeCatGamesArray();
    const testCatGameMatches = makeCatGameMatchesArray();

    beforeEach('insert game category matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            }) 
    });

    it(`creates a game category match, responding with 201 and the new game category match`, () => {
      const newCatGameMatch = {
        cat_id: 123,
        game_id: 10
      };

      return supertest(app)
        .post('/api/games-cat-matches')
        .send(newCatGameMatch)
        .expect(201)
        .expect(res => {
          expect(res.body.cat_id).to.eql(newCatGameMatch.cat_id)
          expect(res.body.game_id).to.eql(newCatGameMatch.game_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/games-cat-matches/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/games-cat-matches/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'cat_id', 'game_id' ];

    requiredFields.forEach(field => {
        const newCatGameMatch = {
            cat_id: 345,
            game_id: 10
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newCatGameMatch[field]

        return supertest(app)
          .post('/api/games-cat-matches')
          .send(newCatGameMatch)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/games-cat-matches/:id`, () => {
    context(`Given no game category matches`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/games-cat-matches/${id}`)
          .expect(404, { error: { message: `Game category match doesn't exist` } })
      })
    });

    context('Given there are game category matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesCat = makeCatGamesArray();
        const testCatGameMatches = makeCatGameMatchesArray();

      beforeEach('insert game category matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('games_cat_matches')
                    .insert(testCatGameMatches)
            })  
      });

      it('responds with 204 and removes the game category match', () => {
        const idToRemove = 2;
        const expectedCatGameMatch = testCatGameMatches.filter(game => game.id !== idToRemove);
        return supertest(app)
          .delete(`/api/games-cat-matches/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat-matches`)
              .expect(expectedCatGameMatch)
          )
      });
    });
  });

  describe(`PATCH /api/games-cat-matches/:id`, () => {
    context(`Given no game category matches`, () => {
      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/games-cat-matches/${id}`)
          .expect(404, { error: { message: `Game category match doesn't exist` } })
      })
    });

    context('Given there are game category matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesCat = makeCatGamesArray();
        const testCatGameMatches = makeCatGameMatchesArray();

      beforeEach('insert game category matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_cat')
                    .insert(testGamesCat)
            })
            .then(() => {
                return db
                    .into('games_cat_matches')
                    .insert(testCatGameMatches)
            })  
      });

      it('responds with 204 and updates the mechanic', () => {
        const idToUpdate = 2;
        const updateCatGameMatch = {
          cat_id: 345,
          game_id: 10
        };
        const expectedCatGameMatch = {
          ...testCatGameMatches[idToUpdate - 1],
          ...updateCatGameMatch
        };
        
        return supertest(app)
          .patch(`/api/games-cat-matches/${idToUpdate}`)
          .send(updateCatGameMatch)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat-matches/${idToUpdate}`)
              .expect(expectedCatGameMatch)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/games-cat-matches/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a category ID and game ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateCatGameMatch = {
            cat_id: 345,
            game_id: 10
        };
        const expectedCatGameMatch = {
          ...testCatGameMatches[idToUpdate - 1],
          ...updateCatGameMatch
        };

        return supertest(app)
          .patch(`/api/games-cat-matches/${idToUpdate}`)
          .send({
            ...updateCatGameMatch,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-cat-matches/${idToUpdate}`)
              .expect(expectedCatGameMatch)
          )
      });
    });
    });
});