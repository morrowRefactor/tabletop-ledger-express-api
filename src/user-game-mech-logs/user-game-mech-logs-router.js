const express = require('express');
const path = require('path');
const UserGamesByCatLogsService = require('../user-game-cat-logs/user-game-cat-logs-service');
const UserGamesByMechLogsService = require('./user-game-mech-logs-service');

const userGamesByMechLogsRouter = express.Router();
const jsonParser = express.json();

const serializeUserGameMechLogs = log => ({
  id: log.id,
  mech_id: log.mech_id,
  uid: log.uid,
  sessions: log.sessions
});

userGamesByMechLogsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserGamesByMechLogsService.getAllUserGameMechLogs(knexInstance)
      .then(logs => {
        res.json(logs.map(serializeUserGameMechLogs))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newUserGameMechLog = req.body;
    let insertCount = 0;

    newUserGameMechLog.forEach(log => {
      const { mech_id, uid, sessions } = log;
      const userGameMechLogsReqs = { mech_id, uid, sessions };

      for (const [key, value] of Object.entries(userGameMechLogsReqs))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });
    })
    
    newUserGameMechLog.forEach(log => {
      const newUserGameMechLog = {
        mech_id: log.mech_id,
        uid: log.uid,
        sessions: log.sessions
      };

      UserGamesByMechLogsService.insertUserGameMechLog(
        req.app.get('db'),
        newUserGameMechLog
      );

      insertCount++;
    });

    if(insertCount === newUserGameMechLog.length) {
      return res
        .status(201)
        .end()
    }
  });

userGamesByMechLogsRouter
  .route('/:id')
  .all((req, res, next) => {
    UserGamesByMechLogsService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(log => {
        if (!log) {
          return res.status(404).json({
            error: { message: `User sessions for this mechanic don't exist` }
          })
        }
        res.log = log
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserGameMechLogs(res.log))
  })
  .delete((req, res, next) => {
    UserGamesByMechLogsService.deleteUserGameMechLog(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { uid, mech_id, sessions } = req.body;
    const userMechLogToUpdate = { uid, mech_id, sessions };

    const numberOfValues = Object.values(userMechLogToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID, mechanic ID, and session number`
        }
      });
    };

    UserGamesByMechLogsService.updateUserGameMechLog(
        req.app.get('db'),
        req.params.id,
        userMechLogToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userGamesByMechLogsRouter;