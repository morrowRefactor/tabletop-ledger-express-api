const knex = require('knex');
const app = require('../src/app');
const { expect } = require('chai');
const { makeGameTipsArray, makeMaliciousGameTips } = require('./game-tips.fixtures');
const { makeUsersArray } = require('./users.fixtures');
const { makeGamesArray } = require('./games.fixtures');

describe('Game Tips Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE users, games, game_tips RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE users, games, game_tips RESTART IDENTITY CASCADE'));

  describe(`GET /api/game-tips`, () => {
    context(`Given no game tips`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/game-tips')
          .expect(200, [])
      })
    });

    context('Given there are game tips in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const testGameTips = makeGameTipsArray();

      beforeEach('insert game tips', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db
                .into('games')
                .insert(testGames)
          })
          .then(() => {
              return db 
                .into('game_tips')
                .insert(testGameTips)
          })
      });

      it('responds with 200 and all of the game tips', () => {
        return supertest(app)
          .get('/api/game-tips')
          .expect(200, testGameTips)
        });
    });

    context(`Given an XSS attack game tip`, () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();
      const { maliciousGameTip, expectedGameTip } = makeMaliciousGameTips();

      beforeEach('insert malicious game tip', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db
                .into('games')
                .insert(testGames)
          })
          .then(() => {
              return db
                .into('game_tips')
                .insert(maliciousGameTip)
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/game-tips`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].tip).to.eql(expectedGameTip.tip)
          })
      });
    });
  });

  describe(`GET /api/game-tips/:tip_id`, () => {
    context(`Given no game tips`, () => {
      it(`responds with 404`, () => {
        const tip_id = 123;
        return supertest(app)
          .get(`/api/game-tips/${tip_id}`)
          .expect(404, { error: { message: `Game tip doesn't exist` } })
      });
    });

    context('Given there are game tips in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testGameTips = makeGameTipsArray();
  
        beforeEach('insert game tips', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db 
                  .into('game_tips')
                  .insert(testGameTips)
            })
        });

      it('responds with 200 and the specified game tip', () => {
        const tip_id = 2
        const expectedGameTip = testGameTips[tip_id - 1]
        return supertest(app)
          .get(`/api/game-tips/${tip_id}`)
          .expect(200, expectedGameTip)
      });
    });

    context(`Given an XSS attack content`, () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const { maliciousGameTip, expectedGameTip } = makeMaliciousGameTips();
  
        beforeEach('insert malicious game tip', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db
                  .into('game_tips')
                  .insert(maliciousGameTip)
            })
        });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/game-tips/${maliciousGameTip.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.tip).to.eql(expectedGameTip.tip)
          })
      });
    });
  });

  describe(`POST /api/game-tips`, () => {

    context('Given there are game tips in the database', () => {
      const testUsers = makeUsersArray();
      const testGames = makeGamesArray();

      beforeEach('insert game tips', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
              return db
                .into('games')
                .insert(testGames)
          })
      });

      it(`creates a game tip, responding with 201 and the new game tip`, () => {
        const newGameTip = {
          uid: 1,
          game_id: 1,
          tip: 'do this, not that'
        };

        return supertest(app)
          .post('/api/game-tips')
          .send(newGameTip)
          .expect(201)
          .expect(res => {
            expect(res.body.game_id).to.eql(newGameTip.game_id)
            expect(res.body.uid).to.eql(newGameTip.uid)
            expect(res.body.tip).to.eql(newGameTip.tip)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/game-tips/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/game-tips/${res.body.id}`)
              .expect(res.body)
          )
      });

      const requiredFields = [ 'uid', 'game_id', 'tip' ];

      requiredFields.forEach(field => {
          const newGameTip = {
              uid: 1,
              game_id: 1,
              tip: 'do something'
          };

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newGameTip[field]

          return supertest(app)
            .post('/api/game-tips')
            .send(newGameTip)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        });
      });

      it('removes XSS attack content from response', () => {
        const { maliciousGameTip, expectedGameTip } = makeMaliciousGameTips();
        return supertest(app)
          .post(`/api/game-tips`)
          .send(maliciousGameTip)
          .expect(201)
          .expect(res => {
              expect(res.body.tip).to.eql(expectedGameTip.tip)
          })
      });
  });
  });

  describe(`DELETE /api/game-tips/:tip_id`, () => {
    context(`Given no game tips`, () => {
      it(`responds with 404`, () => {
        const tip_id = 123;
        return supertest(app)
          .delete(`/api/game-tips/${tip_id}`)
          .expect(404, { error: { message: `Game tip doesn't exist` } })
      })
    });

    context('Given there are game tips in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testGameTips = makeGameTipsArray();
  
        beforeEach('insert game tips', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db 
                  .into('game_tips')
                  .insert(testGameTips)
            })
        });

      it('responds with 204 and removes the game tip', () => {
        const idToRemove = 2
        const expectedGameTip = testGameTips.filter(tip => tip.id !== idToRemove)
        return supertest(app)
          .delete(`/api/game-tips/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/game-tips`)
              .expect(expectedGameTip)
          )
      });
    });
  });

  describe(`PATCH /api/game-tips/:tip_id`, () => {
    context(`Given no game tips`, () => {
      it(`responds with 404`, () => {
        const tip_id = 123;
        return supertest(app)
          .delete(`/api/game-tips/${tip_id}`)
          .expect(404, { error: { message: `Game tip doesn't exist` } })
      })
    });

    context('Given there are game tips in the database', () => {
        const testUsers = makeUsersArray();
        const testGames = makeGamesArray();
        const testGameTips = makeGameTipsArray();
  
        beforeEach('insert game tips', () => {
          return db
            .into('users')
            .insert(testUsers)
            .then(() => {
                return db
                  .into('games')
                  .insert(testGames)
            })
            .then(() => {
                return db 
                  .into('game_tips')
                  .insert(testGameTips)
            })
        });

      it('responds with 204 and updates the game tips', () => {
        const idToUpdate = 2;
        const updateGameTip = {
          uid: 1,
          game_id: 4,
          tip: 'New tip'
        };
        const expectedGameTip = {
          ...testGameTips[idToUpdate - 1],
          ...updateGameTip
        };
        return supertest(app)
          .patch(`/api/game-tips/${idToUpdate}`)
          .send(updateGameTip)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/game-tips/${idToUpdate}`)
              .expect(expectedGameTip)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/game-tips/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a user ID, game ID, and tip`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateGameTip = {
            game_id: 9,
            tip: 'new tip'
        };
        const expectedGameTip = {
          ...testGameTips[idToUpdate - 1],
          ...updateGameTip
        };

        return supertest(app)
          .patch(`/api/game-tips/${idToUpdate}`)
          .send({
            ...updateGameTip,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/game-tips/${idToUpdate}`)
              .expect(expectedGameTip)
          )
      });
    });
    });
});