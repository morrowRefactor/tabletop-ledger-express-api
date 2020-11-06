const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeMechGameMatchesArray } = require('./games-mech-matches.fixtures');
const { makeGamesArray } = require('./games.fixtures');
const { makeMechGamesArray}  = require('./games-mech.fixtures');

describe.only('Game Mechanic Matches Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE games, games_mech, games_mech_matches RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE games, games_mech, games_mech_matches RESTART IDENTITY CASCADE'));

  describe(`GET /api/games-mech-matches`, () => {
    context(`Given no game mechanic matches`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/games-mech-matches')
          .expect(200, [])
      })
    });

    context('Given there are game mechanic matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesMech = makeMechGamesArray();
        const testMechGameMatches = makeMechGameMatchesArray();

      beforeEach('insert game mechanic matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('games_mech_matches')
                    .insert(testMechGameMatches)
            })  
      });

      it('responds with 200 and all of the game mechanic matches', () => {
        return supertest(app)
          .get('/api/games-mech-matches')
          .expect(200, testMechGameMatches)
        });
    });
  });

  describe(`GET /api/games-mech-matches/:id`, () => {
    context(`Given no game mechanic matches`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .get(`/api/games-mech-matches/${id}`)
          .expect(404, { error: { message: `Game mechanic match doesn't exist` } })
      });
    });

    context('Given there are game mechanic matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesMech = makeMechGamesArray();
        const testMechGameMatches = makeMechGameMatchesArray();

      beforeEach('insert game mechanic matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('games_mech_matches')
                    .insert(testMechGameMatches)
            })  
      });

      it('responds with 200 and the specified game mechanic match', () => {
        const id = 2;
        const expectedMechGameMatch = testMechGameMatches[id - 1];
        return supertest(app)
          .get(`/api/games-mech-matches/${id}`)
          .expect(200, expectedMechGameMatch)
      });
    });
  });

  describe(`POST /api/games-mech-matches`, () => {
    const testGames = makeGamesArray();
    const testGamesMech = makeMechGamesArray();

    beforeEach('insert game mechanic matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            }) 
    });

    it(`creates a game category match, responding with 201 and the new game category match`, () => {
      const newMechGameMatch = {
        mech_id: 123,
        game_id: 10
      };

      return supertest(app)
        .post('/api/games-mech-matches')
        .send(newMechGameMatch)
        .expect(201)
        .expect(res => {
          expect(res.body.mech_id).to.eql(newMechGameMatch.mech_id)
          expect(res.body.game_id).to.eql(newMechGameMatch.game_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/games-mech-matches/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/games-mech-matches/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = [ 'mech_id', 'game_id' ];

    requiredFields.forEach(field => {
        const newMechGameMatch = {
            mech_id: 345,
            game_id: 10
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMechGameMatch[field]

        return supertest(app)
          .post('/api/games-mech-matches')
          .send(newMechGameMatch)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
  });

  describe(`DELETE /api/games-mech-matches/:id`, () => {
    context(`Given no game mechanic matches`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/games-mech-matches/${id}`)
          .expect(404, { error: { message: `Game mechanic match doesn't exist` } })
      })
    });

    context('Given there are game mechanic matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesMech = makeMechGamesArray();
        const testMechGameMatches = makeMechGameMatchesArray();

      beforeEach('insert game mechanic matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('games_mech_matches')
                    .insert(testMechGameMatches)
            })  
      });

      it('responds with 204 and removes the game category match', () => {
        const idToRemove = 2;
        const expectedMechGameMatch = testMechGameMatches.filter(game => game.id !== idToRemove);
        return supertest(app)
          .delete(`/api/games-mech-matches/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech-matches`)
              .expect(expectedMechGameMatch)
          )
      });
    });
  });

  describe(`PATCH /api/games-mech-matches/:id`, () => {
    context(`Given no game mechanic matches`, () => {
      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/games-mech-matches/${id}`)
          .expect(404, { error: { message: `Game mechanic match doesn't exist` } })
      })
    });

    context('Given there are game mechanic matches in the database', () => {
        const testGames = makeGamesArray();
        const testGamesMech = makeMechGamesArray();
        const testMechGameMatches = makeMechGameMatchesArray();

      beforeEach('insert game mechanic matches', () => {
        return db
            .into('games')
            .insert(testGames)
            .then(() => {
                return db
                    .into('games_mech')
                    .insert(testGamesMech)
            })
            .then(() => {
                return db
                    .into('games_mech_matches')
                    .insert(testMechGameMatches)
            })  
      });

      it('responds with 204 and updates the mechanic', () => {
        const idToUpdate = 2;
        const updateMechGameMatch = {
          mech_id: 345,
          game_id: 10
        };
        const expectedMechGameMatch = {
          ...testMechGameMatches[idToUpdate - 1],
          ...updateMechGameMatch
        };
        
        return supertest(app)
          .patch(`/api/games-mech-matches/${idToUpdate}`)
          .send(updateMechGameMatch)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech-matches/${idToUpdate}`)
              .expect(expectedMechGameMatch)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/games-mech-matches/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a mechanic ID and game ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateMechGameMatch = {
            mech_id: 345,
            game_id: 10
        };
        const expectedMechGameMatch = {
          ...testMechGameMatches[idToUpdate - 1],
          ...updateMechGameMatch
        };

        return supertest(app)
          .patch(`/api/games-mech-matches/${idToUpdate}`)
          .send({
            ...updateMechGameMatch,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech-matches/${idToUpdate}`)
              .expect(expectedMechGameMatch)
          )
      });
    });
    });
});