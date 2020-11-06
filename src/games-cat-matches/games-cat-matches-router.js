const express = require('express');
const path = require('path');
const CatGameMatchesService = require('./games-cat-matches-service');

const gamesCatMatchesRouter = express.Router();
const jsonParser = express.json();

const serializeCatGameMatches = game => ({
  id: game.id,
  cat_id: game.cat_id,
  game_id: game.game_id
});

gamesCatMatchesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    CatGameMatchesService.getAllCatGameMatches(knexInstance)
      .then(game => {
        res.json(game.map(serializeCatGameMatches))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { cat_id, game_id } = req.body;
    const newCatGameMatch = { cat_id, game_id };

    for (const [key, value] of Object.entries(newCatGameMatch))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    CatGameMatchesService.insertCatGameMatch(
      req.app.get('db'),
      newCatGameMatch
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(serializeCatGameMatches(game));
      })
      .catch(next)
  });

gamesCatMatchesRouter
  .route('/:id')
  .all((req, res, next) => {
    CatGameMatchesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game category match doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCatGameMatches(res.game))
  })
  .delete((req, res, next) => {
    CatGameMatchesService.deleteCatGameMatch(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { cat_id, game_id } = req.body;
    const newCatGameMatch = { cat_id, game_id };

    const numberOfValues = Object.values(newCatGameMatch).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a category ID and game ID`
        }
      });
    };

    CatGameMatchesService.updateCatGameMatch(
        req.app.get('db'),
        req.params.id,
        newCatGameMatch
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesCatMatchesRouter;