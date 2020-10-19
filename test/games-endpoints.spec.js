const knex = require('knex');
const app = require('../src/app');
const { makeGamesArray, makeMaliciousGame } = require('./games.fixtures');
const { expect } = require('chai');
const gamesRouter = require('../src/games/games-router');

describe.only('Games Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE games RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE games RESTART IDENTITY CASCADE'));

  describe(`GET /api/games`, () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/games')
          .expect(200, [])
      })
    });

    context('Given there are games in the database', () => {
      const testGames = makeGamesArray();

      beforeEach('insert games', () => {
        return db
          .into('games')
          .insert(testGames)
      });

      it('responds with 200 and all of the games', () => {
        return supertest(app)
          .get('/api/games')
          .expect(200, testGames)
        });
    });

    context(`Given an XSS attack game`, () => {
      const { maliciousGame, expectedGame } = makeMaliciousGame();

      beforeEach('insert malicious game', () => {
        return db
          .into('games')
          .insert(maliciousGame)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedGame.title)
            expect(res.body[0].image).to.eql(expectedGame.image)
            expect(res.body[0].description).to.eql(expectedGame.description)
          })
      });
    });
  });

  describe(`GET /api/games/:game_id`, () => {
    context(`Given no game`, () => {
      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .get(`/api/games/${game_id}`)
          .expect(404, { error: { message: `Game doesn't exist` } })
      });
    });

    context('Given there are games in the database', () => {
      const testGames = makeGamesArray();

      beforeEach('insert games', () => {
        return db
          .into('games')
          .insert(testGames)
      });

      it('responds with 200 and the specified game', () => {
        const game_id = 2
        const expectedGame = testGames[game_id - 1]
        return supertest(app)
          .get(`/api/games/${game_id}`)
          .expect(200, expectedGame)
      });
    });

    context(`Given an XSS attack content`, () => {
      const { maliciousGame, expectedGame } = makeMaliciousGame();

      beforeEach('insert malicious game', () => {
        return db
          .into('games')
          .insert(maliciousGame)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/games/${maliciousGame.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedGame.title)
            expect(res.body.image).to.eql(expectedGame.image)
            expect(res.body.description).to.eql(expectedGame.description)
          })
      });
    });
  });

  describe(`POST /api/games`, () => {

    it(`creates a game, responding with 201 and the new game`, () => {
      const newGame = {
        title: 'test user',
        image: 'cywyb3Y6Qxg',
        description: 'test description',
        bgg_id: 1234,
        bgg_rating: '8.9'
      };

      return supertest(app)
        .post('/api/games')
        .send(newGame)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newGame.title)
          expect(res.body.image).to.eql(newGame.image)
          expect(res.body.description).to.eql(newGame.description)
          expect(res.body.bgg_id).to.eql(newGame.bgg_id)
          expect(res.body.bgg_rating).to.eql(newGame.bgg_rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/games/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/games/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = ['title', 'image', 'description', 'bgg_id', 'bgg_rating'];

    requiredFields.forEach(field => {
        const newGame = {
            title: 'test user',
            image: 'cywyb3Y6Qxg',
            description: 'test description',
            bgg_id: 1234,
            bgg_rating: '8.9'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newGame[field]

        return supertest(app)
          .post('/api/games')
          .send(newGame)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousGame, expectedGame } = makeMaliciousGame();
      return supertest(app)
        .post(`/api/games`)
        .send(maliciousGame)
        .expect(201)
        .expect(res => {
            expect(res.body.title).to.eql(expectedGame.title)
            expect(res.body.image).to.eql(expectedGame.image)
            expect(res.body.description).to.eql(expectedGame.description)
        })
    });
  });

  describe(`DELETE /api/games/:game_id`, () => {
    context(`Given no games`, () => {
      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .delete(`/api/games/${game_id}`)
          .expect(404, { error: { message: `Game doesn't exist` } })
      })
    });

    context('Given there are games in the database', () => {
      const testGames = makeGamesArray();

      beforeEach('insert games', () => {
        return db
          .into('games')
          .insert(testGames)
      });

      it('responds with 204 and removes the game', () => {
        const idToRemove = 2
        const expectedGame = testGames.filter(game => game.id !== idToRemove)
        return supertest(app)
          .delete(`/api/games/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games`)
              .expect(expectedGame)
          )
      });
    });
  });

  describe(`PATCH /api/games/:game_id`, () => {
    context(`Given no games`, () => {
      it(`responds with 404`, () => {
        const game_id = 123;
        return supertest(app)
          .delete(`/api/games/${game_id}`)
          .expect(404, { error: { message: `Game doesn't exist` } })
      })
    });

    context('Given there are games in the database', () => {
      const testGames = makeGamesArray();

      beforeEach('insert games', () => {
        return db
          .into('games')
          .insert(testGames)
      });

      it('responds with 204 and updates the game', () => {
        const idToUpdate = 2;
        const updateGame = {
          title: 'updated title',
          description: 'new description',
          bgg_id: 3456,
          bgg_rating: '5.4'
        };
        const expectedGame = {
          ...testGames[idToUpdate - 1],
          ...updateGame
        };
        return supertest(app)
          .patch(`/api/games/${idToUpdate}`)
          .send(updateGame)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games/${idToUpdate}`)
              .expect(expectedGame)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/games/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a title, description, image link, BGG ID, and BGG rating`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateGame = {
          title: 'updated title',
          description: 'new description',
          bgg_id: 3456,
          bgg_rating: '5.4'
        };
        const expectedGame = {
          ...testGames[idToUpdate - 1],
          ...updateGame
        };

        return supertest(app)
          .patch(`/api/games/${idToUpdate}`)
          .send({
            ...updateGame,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/games/${idToUpdate}`)
              .expect(expectedGame)
          )
      });
    });
    });
});