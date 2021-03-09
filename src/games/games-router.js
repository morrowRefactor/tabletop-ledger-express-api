const express = require('express');
const xss = require('xss');
const path = require('path');
const GamesService = require('./games-service');

const gamesRouter = express.Router();
const jsonParser = express.json();

const serializeGames = game => ({
  id: game.id,
  title: xss(game.title),
  description: xss(game.description),
  image: xss(game.image),
  bgg_id: game.bgg_id,
  bgg_rating: game.bgg_rating
});

gamesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    res.json(knexInstance)
    /*
    GamesService.getAllGames(knexInstance)
      .then(game => {
        res.json(game.map(serializeGames))
      })
      .catch(next)*/
  })
  .post(jsonParser, (req, res, next) => {
    const { title, description, image, bgg_id, bgg_rating } = req.body;
    const newGame = { title, description, image, bgg_id, bgg_rating };

    for (const [key, value] of Object.entries(newGame))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    GamesService.insertGame(
      req.app.get('db'),
      newGame
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(serializeGames(game));
      })
      .catch(next)
  });

gamesRouter
  .route('/:game_id')
  .all((req, res, next) => {
    GamesService.getById(
      req.app.get('db'),
      req.params.game_id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeGames(res.game))
  })
  .delete((req, res, next) => {
    GamesService.deleteGame(
      req.app.get('db'),
      req.params.game_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, description, image, bgg_id, bgg_rating } = req.body;
    const gameToUpdate = { title, description, image, bgg_id, bgg_rating };

    const numberOfValues = Object.values(gameToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a title, description, image link, BGG ID, and BGG rating`
        }
      });
    };

    GamesService.updateGame(
        req.app.get('db'),
        req.params.game_id,
        gameToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesRouter;