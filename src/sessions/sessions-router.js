const express = require('express');
const xss = require('xss');
const path = require('path');
const SessionsService = require('./sessions-service');
const { requireAuth } = require('../middleware/jwt-auth');

const sessionsRouter = express.Router();
const jsonParser = express.json();

const serializeSessions = sess => ({
  id: sess.id,
  game_id: sess.game_id,
  uid: sess.uid,
  date: sess.date.toISOString().substr(0,10),
  name: xss(sess.name)
});

sessionsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    SessionsService.getAllSessions(knexInstance)
      .then(sess => {
        res.json(sess.map(serializeSessions))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { game_id, uid, date, name } = req.body;
    const newSession = { game_id, uid, date, name };
    const newSessReqs = { game_id, uid, date };

    for (const [key, value] of Object.entries(newSessReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    SessionsService.insertSession(
      req.app.get('db'),
      newSession
    )
      .then(sess => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${sess.id}`))
          .json(serializeSessions(sess));
      })
      .catch(next)
  });

sessionsRouter
  .route('/:sess_id')
  .all((req, res, next) => {
    SessionsService.getById(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(sess => {
        if (!sess) {
          return res.status(404).json({
            error: { message: `Session doesn't exist` }
          })
        }
        res.sess = sess
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSessions(res.sess))
  })
  .delete(requireAuth, (req, res, next) => {
    SessionsService.deleteSession(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { game_id, uid, date } = req.body;
    const sessionToUpdate = { game_id, uid, date };

    const numberOfValues = Object.values(sessionToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a game ID, user ID, and session date`
        }
      });
    };

    SessionsService.updateSession(
        req.app.get('db'),
        req.params.sess_id,
        sessionToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

  sessionsRouter
    .route('/user-sessions/:uid')
    .all((req, res, next) => {
      const returnArr = [];
      if(req.params.uid === '0') {
        res.status(200).json(returnArr)
      }
      else {
        SessionsService.getUserSessions(
          req.app.get('db'),
          req.params.uid
        )
          .then(sess => {
            if (!sess || sess.length < 1) {
              return res.status(404).json({
                error: { message: `User sessions don't exist` }
              })
            }
            res.sess = sess
            next()
          })
          .catch(next)
      }
    })
    .get((req, res, next) => {
      res.json(res.sess)
    })

    sessionsRouter
    .route('/game-sessions/:game_id')
    .all((req, res, next) => {
      const returnArr = [];
      if(req.params.game_id === '0') {
        res.status(200).json(returnArr)
      }
      else {
        SessionsService.getSessionsByGame(
          req.app.get('db')
        )
          .then(sess => {
            if (!sess || sess.length < 1) {
              return res.status(404).json({
                error: { message: `Game sessions don't exist` }
              })
            }
            res.sess = sess
            next()
          })
          .catch(next)
    }})
    .get((req, res, next) => {
      res.json(res.sess)
    })

module.exports = sessionsRouter;