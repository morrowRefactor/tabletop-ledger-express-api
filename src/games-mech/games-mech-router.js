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
    const newGameMech = req.body;
    let insertCount = 0;

    newGameMech.forEach(game => {
      const { mech_id, name } = game;
      const gameMechReqs = { mech_id, name };

      for (const [key, value] of Object.entries(gameMechReqs))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });
    })
    
    newGameMech.forEach(game => {
      const gameMech = {
        mech_id: game.mech_id,
        name: game.name
      };

      MechGamesService.insertMechGame(
        req.app.get('db'),
        gameMech
      )

      insertCount++;
    })
    
    if(insertCount === newGameMech.length) {
      return res
        .status(201)
        .end()
    }
  });

gamesMechRouter
  .route('/:id')
  .all((req, res, next) => {
    MechGamesService.getById(
      req.app.get('db'),
      req.params.id
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
      req.params.id
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

    MechGamesService.updateMechGame(
        req.app.get('db'),
        req.params.id,
        newMechGame
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesMechRouter;