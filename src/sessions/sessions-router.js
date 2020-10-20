const express = require('express');
const xss = require('xss');
const path = require('path');
const SessionsService = require('./sessions-service');

const sessionsRouter = express.Router();
const jsonParser = express.json();

const serializeSessions = sess => ({
  id: sess.id,
  game_id: sess.game_id,
  uid: sess.uid,
  date: sess.date
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
  .post(jsonParser, (req, res, next) => {
    const { game_id, uid, date } = req.body;
    const newSession = { game_id, uid, date };

    for (const [key, value] of Object.entries(newSession))
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
  .delete((req, res, next) => {
    SessionsService.deleteSession(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
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

    SessionsService.updateGame(
        req.app.get('db'),
        req.params.sess_id,
        sessionToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = sessionsRouter;