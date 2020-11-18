const express = require('express');
const path = require('path');
const UserGamesByCatLogsService = require('./user-game-cat-logs-service');

const userGamesByCatLogsRouter = express.Router();
const jsonParser = express.json();

const serializeUserGameCatLogs = log => ({
  id: log.id,
  cat_id: log.cat_id,
  uid: log.uid,
  sessions: log.sessions
});

userGamesByCatLogsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserGamesByCatLogsService.getAllUserGameCatLogs(knexInstance)
      .then(logs => {
        res.json(logs.map(serializeUserGameCatLogs))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newUserGameCatLog = req.body;
    let insertCount = 0;

    newUserGameCatLog.forEach(log => {
      const { cat_id, uid, sessions } = log;
      const userGameCatLogsReqs = { cat_id, uid, sessions };

      for (const [key, value] of Object.entries(userGameCatLogsReqs))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });
    })
    
    newUserGameCatLog.forEach(log => {
      const newUserGameCatLog = {
        cat_id: log.cat_id,
        uid: log.uid,
        sessions: log.sessions
      };

      UserGamesByCatLogsService.insertUserGameCatLog(
        req.app.get('db'),
        newUserGameCatLog
      );

      insertCount++;
    });

    if(insertCount === newUserGameCatLog.length) {
      return res
        .status(201)
        .end()
    }
  });

userGamesByCatLogsRouter
  .route('/:id')
  .all((req, res, next) => {
    UserGamesByCatLogsService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(log => {
        if (!log) {
          return res.status(404).json({
            error: { message: `User sessions for this category don't exist` }
          })
        }
        res.log = log
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserGameCatLogs(res.log))
  })
  .delete((req, res, next) => {
    UserGamesByCatLogsService.deleteUserGameCatLog(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { cat_id, uid, sessions } = req.body;
    const newUserGameCatLog = { cat_id, uid, sessions };

    const numberOfValues = Object.values(newUserGameCatLog).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a category ID, user ID, and number of sessions`
        }
      });
    };

    UserGamesByCatLogsService.updateUserGameCatLog(
        req.app.get('db'),
        req.params.id,
        newUserGameCatLog
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userGamesByCatLogsRouter;