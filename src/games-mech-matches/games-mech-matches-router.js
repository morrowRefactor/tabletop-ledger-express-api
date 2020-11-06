const express = require('express');
const path = require('path');
const MechGameMatchesService = require('./games-mech-matches-service');

const gamesMechMatchesRouter = express.Router();
const jsonParser = express.json();

const serializeMechGameMatches = game => ({
  id: game.id,
  mech_id: game.mech_id,
  game_id: game.game_id
});

gamesMechMatchesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MechGameMatchesService.getAllMechGameMatches(knexInstance)
      .then(game => {
        res.json(game.map(serializeMechGameMatches))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { mech_id, game_id } = req.body;
    const newMechGameMatch = { mech_id, game_id };

    for (const [key, value] of Object.entries(newMechGameMatch))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    MechGameMatchesService.insertMechGameMatch(
      req.app.get('db'),
      newMechGameMatch
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(serializeMechGameMatches(game));
      })
      .catch(next)
  });

gamesMechMatchesRouter
  .route('/:id')
  .all((req, res, next) => {
    MechGameMatchesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game mechanic match doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeMechGameMatches(res.game))
  })
  .delete((req, res, next) => {
    MechGameMatchesService.deleteMechGameMatch(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { mech_id, game_id } = req.body;
    const newMechGameMatch = { mech_id, game_id };

    const numberOfValues = Object.values(newMechGameMatch).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a mechanic ID and game ID`
        }
      });
    };

    MechGameMatchesService.updateMechGameMatch(
        req.app.get('db'),
        req.params.id,
        newMechGameMatch
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesMechMatchesRouter;