const express = require('express');
const xss = require('xss');
const path = require('path');
const MechGamesService = require('./games-mech-service');

const gamesMechRouter = express.Router();
const jsonParser = express.json();

const serializeMechGames = game => ({
  id: game.id,
  mech_id: game.mech_id,
  name: xss(game.name)
});

gamesMechRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MechGamesService.getAllMechGames(knexInstance)
      .then(game => {
        res.json(game.map(serializeMechGames))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { mech_id, name } = req.body;
    const newMechGame = { mech_id, name };

    for (const [key, value] of Object.entries(newMechGame))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    MechGamesService.insertMechGame(
      req.app.get('db'),
      newMechGame
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.mech_id}`))
          .json(serializeMechGames(game));
      })
      .catch(next)
  });

gamesMechRouter
  .route('/:mech_id')
  .all((req, res, next) => {
    MechGamesService.getById(
      req.app.get('db'),
      req.params.mech_id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game mechanic doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeMechGames(res.game))
  })
  .delete((req, res, next) => {
    MechGamesService.deleteMechGame(
      req.app.get('db'),
      req.params.mech_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { mech_id, name } = req.body;
    const newMechGame = { mech_id, name };

    const numberOfValues = Object.values(newMechGame).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a mechanic name and BGG ID`
        }
      });
    };

    MechGamesService.updateMechBadge(
        req.app.get('db'),
        req.params.mech_id,
        newMechGame
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesMechRouter;