const express = require('express');
const xss = require('xss');
const path = require('path');
const SessionScoresService = require('./session-scores-service');

const sessionScoresRouter = express.Router();
const jsonParser = express.json();

const serializeSessionScores = sess => ({
  id: sess.id,
  session_id: sess.session_id,
  game_id: sess.game_id,
  uid: sess.uid,
  score: sess.score,
  name: xss(sess.name),
  winner: sess.winner
});

sessionScoresRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    SessionScoresService.getAllScores(knexInstance)
      .then(sess => {
        res.json(sess.map(serializeSessionScores))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newSessionScores = req.body;
    let sessCount;

    newSessionScores.forEach(sess => {
      const { session_id, game_id, score, name, winner } = sess;
      const sessionScoreReqs = { session_id, game_id, score, name, winner };

      for (const [key, value] of Object.entries(sessionScoreReqs))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
      });
    });

    const promise = new Promise(function (resolve) {
      newSessionScores.forEach(sess => {
        const sessScore = {
          session_id: sess.session_id,
          game_id: sess.game_id,
          uid: sess.uid,
          score: sess.score,
          name: sess.name,
          winner: sess.winner
        };

        SessionScoresService.insertScores(
          req.app.get('db'),
          sessScore
        )
      })
      
      return resolve();
    });
    
    promise.then(()=> {
        return res
          .status(201)
    })
    .catch(next)
  });

sessionScoresRouter
  .route('/:sess_id')
  .all((req, res, next) => {
    SessionScoresService.getById(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(sess => {
        if (!sess) {
          return res.status(404).json({
            error: { message: `Session scores don't exist` }
          })
        }
        res.sess = sess
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSessionScores(res.sess))
  })
  .delete((req, res, next) => {
    SessionScoresService.deleteScores(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { session_id, game_id, uid, score, name, winner } = req.body;
    const newSessionScore = { session_id, game_id, uid, score, name, winner };
    const scoresToUpdate = { session_id, game_id, score, name, winner };

    const numberOfValues = Object.values(scoresToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a session ID, game ID, score, name, and winner`
        }
      });
    };

    SessionScoresService.updateScores(
        req.app.get('db'),
        req.params.sess_id,
        newSessionScore
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = sessionScoresRouter;