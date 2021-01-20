const express = require('express');
const xss = require('xss');
const path = require('path');
const GameTipsService = require('./game-tips-service');
const { requireAuth } = require('../middleware/jwt-auth');

const gameTipsRouter = express.Router();
const jsonParser = express.json();

const serializeGameTips = tip => ({
  id: tip.id,
  uid: tip.uid,
  game_id: tip.game_id,
  tip: xss(tip.tip)
});

gameTipsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    GameTipsService.getAllGameTips(knexInstance)
      .then(tip => {
        res.json(tip.map(serializeGameTips))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { uid, game_id, tip } = req.body;
    const newGameTip = { uid, game_id, tip };
    
    for (const [key, value] of Object.entries(newGameTip))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    GameTipsService.insertGameTip(
      req.app.get('db'),
      newGameTip
    )
      .then(tip => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tip.id}`))
          .json(serializeGameTips(tip));
      })
      .catch(next)
  });

gameTipsRouter
  .route('/:tip_id')
  .all((req, res, next) => {
    GameTipsService.getById(
      req.app.get('db'),
      req.params.tip_id
    )
      .then(tip => {
        if (!tip) {
          return res.status(404).json({
            error: { message: `Game tip doesn't exist` }
          })
        }
        res.tip = tip
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeGameTips(res.tip))
  })
  .delete(requireAuth, (req, res, next) => {
    GameTipsService.deleteGameTip(
      req.app.get('db'),
      req.params.tip_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { uid, game_id, tip } = req.body;
    const newGameTip = { uid, game_id, tip };

    const numberOfValues = Object.values(newGameTip).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID, game ID, and tip`
        }
      });
    };

    GameTipsService.updateGameTip(
        req.app.get('db'),
        req.params.tip_id,
        newGameTip
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gameTipsRouter;