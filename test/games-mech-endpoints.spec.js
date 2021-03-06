const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeMechGamesArray, makeMaliciousMechGames } = require('./games-mech.fixtures');

describe('Game Mechanics Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE games_mech RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE games_mech RESTART IDENTITY CASCADE'));

  describe(`GET /api/games-mech`, () => {
    context(`Given no game mechanics`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/games-mech')
          .expect(200, [])
      })
    });

    context('Given there are game mechanics in the database', () => {
      const testMechGames = makeMechGamesArray();

      beforeEach('insert game mechanics', () => {
        return db
            .into('games_mech')
            .insert(testMechGames)
      });

      it('responds with 200 and all of the game mechanics', () => {
        return supertest(app)
          .get('/api/games-mech')
          .expect(200, testMechGames)
        });
    });

    context(`Given an XSS attack`, () => {
      const { maliciousMechGame, expectedMechGame } = makeMaliciousMechGames();

      beforeEach('insert malicious Game mechanic', () => {
        return db
            .into('games_mech')
            .insert(maliciousMechGame[0])
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games-mech`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedMechGame[0].name)
            expect(res.body[0].mech_id).to.eql(expectedMechGame[0].mech_id)
          })
      });
    });
  });

  describe(`GET /api/games-mech/:mech_id`, () => {
    context(`Given no game mechanics`, () => {
      it(`responds with 404`, () => {
        const mech_id = 123;
        return supertest(app)
          .get(`/api/games-mech/${mech_id}`)
          .expect(404, { error: { message: `Game mechanic doesn't exist` } })
      });
    });

    context('Given there are mechanics in the database', () => {
        const testMechGames = makeMechGamesArray();
  
        beforeEach('insert mechanics', () => {
          return db
            .into('games_mech')
            .insert(testMechGames)
        });

      it('responds with 200 and the specified mechanic', () => {
        const id = 2;
        const expectedMechGame = testMechGames[id - 1];
        return supertest(app)
          .get(`/api/games-mech/${id}`)
          .expect(200, expectedMechGame)
      });
    });

    context(`Given an XSS attack content`, () => {
        const { maliciousMechGame, expectedMechGame } = makeMaliciousMechGames();
  
        beforeEach('insert malicious category', () => {
          return db
            .into('games_mech')
            .insert(maliciousMechGame[0])
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games-mech/${maliciousMechGame[0].id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedMechGame[0].name)
            expect(res.body.mech_id).to.eql(expectedMechGame[0].mech_id)
          })
      });
    });
  });

  describe(`POST /api/games-mech`, () => {

    it(`creates a mechanic, responding with 201 and the new mechanic`, () => {
      const newMechGame = [
        {
          name: 'New mech',
          mech_id: 567
        },
        {
          name: 'Another new mech',
          mech_id: 888
        }
      ];

      return supertest(app)
        .post('/api/games-mech')
        .send(newMechGame)
        .expect(201)
    });
    
    const requiredFields = [ 'name', 'mech_id' ];

    requiredFields.forEach(field => {
        const newMechGame = [{
            name: 'new mech',
            mech_id: 567
        }];

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMechGame[0][field]

        return supertest(app)
          .post('/api/games-mech')
          .send(newMechGame)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });
    
    it('removes XSS attack content from response', () => {
      const { maliciousMechGame } = makeMaliciousMechGames();
      return supertest(app)
        .post(`/api/games-mech`)
        .send(maliciousMechGame)
        .expect(201)
    });
  });

  describe(`DELETE /api/games-mech/:mech_id`, () => {
    context(`Given no game mechanics`, () => {
      it(`responds with 404`, () => {
        const id = 123;
        return supertest(app)
          .delete(`/api/games-mech/${id}`)
          .expect(404, { error: { message: `Game mechanic doesn't exist` } })
      })
    });

    context('Given there are game mechanics in the database', () => {
        const testMechGames = makeMechGamesArray();
  
        beforeEach('insert mechanic', () => {
          return db
            .into('games_mech')
            .insert(testMechGames)
        });

      it('responds with 204 and removes the mechanic', () => {
        const idToRemove = 2;
        const expectedMechGame = testMechGames.filter(game => game.id !== idToRemove);
        return supertest(app)
          .delete(`/api/games-mech/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech`)
              .expect(expectedMechGame)
          )
      });
    });
  });

  describe(`PATCH /api/games-mech/:id`, () => {
    context(`Given no game mechanics`, () => {
      it(`responds with 404`, () => {
        const id = 222;
        return supertest(app)
          .delete(`/api/games-mech/${id}`)
          .expect(404, { error: { message: `Game mechanic doesn't exist` } })
      })
    });

    context('Given there are game mechanics in the database', () => {
        const testMechGames = makeMechGamesArray();
  
        beforeEach('insert mechanic', () => {
          return db
            .into('games_mech')
            .insert(testMechGames)
        });

      it('responds with 204 and updates the mechanic', () => {
        const idToUpdate = 2;
        const updateMechGame = {
          name: 'new mech name',
          mech_id: 567
        };
        const expectedMechGame = {
          ...testMechGames[idToUpdate - 1],
          ...updateMechGame
        };
        
        return supertest(app)
          .patch(`/api/games-mech/${idToUpdate}`)
          .send(updateMechGame)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech/${idToUpdate}`)
              .expect(expectedMechGame)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/games-mech/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a mechanic name and BGG ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateMechGame = {
            name: 'new mech name',
            mech_id: 567
        };
        const expectedMechGame = {
          ...testMechGames[idToUpdate - 1],
          ...updateMechGame
        };

        return supertest(app)
          .patch(`/api/games-mech/${idToUpdate}`)
          .send({
            ...updateMechGame,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games-mech/${idToUpdate}`)
              .expect(expectedMechGame)
          )
      });
    });
    });
});