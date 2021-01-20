const express = require('express');
const xss = require('xss');
const path = require('path');
const UserGamesService = require('./user-games-service');
const { requireAuth } = require('../middleware/jwt-auth');

const userGamesRouter = express.Router();
const jsonParser = express.json();

const serializeUserGames = game => ({
  id: game.id,
  uid: game.uid,
  game_id: game.game_id,
  own: game.own,
  favorite: game.favorite,
  rating: game.rating,
  notes: xss(game.notes)
});

userGamesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserGamesService.getAllUserGames(knexInstance)
      .then(game => {
        res.json(game.map(serializeUserGames))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { uid, game_id, own, favorite, rating, notes } = req.body;
    const newUserGame = { uid, game_id, own, favorite, rating, notes };
    const userGameReqs = { uid, game_id };

    for (const [key, value] of Object.entries(userGameReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    
    UserGamesService.insertUserGame(
      req.app.get('db'),
      newUserGame
    )
      .then(game => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(serializeUserGames(game));
      })
      .catch(next)
  });

userGamesRouter
  .route('/:game_id')
  .all((req, res, next) => {
    UserGamesService.getById(
      req.app.get('db'),
      req.params.game_id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `User game doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserGames(res.game))
  })
  .delete(requireAuth, (req, res, next) => {
    UserGamesService.deleteUserGame(
      req.app.get('db'),
      req.params.game_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { uid, game_id, own, favorite, rating, notes } = req.body;
    const newUserGame = { uid, game_id, own, favorite, rating, notes };
    const userGameReqs = { uid, game_id };

    const numberOfValues = Object.values(userGameReqs).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID and game ID`
        }
      });
    };
    
    UserGamesService.updateUserGame(
        req.app.get('db'),
        req.params.game_id,
        newUserGame
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userGamesRouter;