const express = require('express');
const path = require('path');
const UserStandingsService = require('./user-standings-service');
const { requireAuth } = require('../middleware/jwt-auth');

const userStandingsRouter = express.Router();
const jsonParser = express.json();

const serializeUserStandings = stand => ({
  id: stand.id,
  uid: stand.uid,
  wins: stand.wins,
  losses: stand.losses,
  sessions: stand.sessions
});

userStandingsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserStandingsService.getAllUserStandings(knexInstance)
      .then(stand => {
        res.json(stand.map(serializeUserStandings))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { uid, wins, losses, sessions } = req.body;
    const newUserStandings = { uid, wins, losses, sessions };

    for (const [key, value] of Object.entries(newUserStandings))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    UserStandingsService.insertUserStandings(
      req.app.get('db'),
      newUserStandings
    )
      .then(stand => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${stand.id}`))
          .json(serializeUserStandings(stand));
      })
      .catch(next)
  });

userStandingsRouter
  .route('/:stand_id')
  .all((req, res, next) => {
    UserStandingsService.getById(
      req.app.get('db'),
      req.params.stand_id
    )
      .then(stand => {
        if (!stand) {
          return res.status(404).json({
            error: { message: `User standing doesn't exist` }
          })
        }
        res.stand = stand
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserStandings(res.stand))
  })
  .delete(requireAuth, (req, res, next) => {
    UserStandingsService.deleteUserStandings(
      req.app.get('db'),
      req.params.stand_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { uid, wins, losses, sessions } = req.body;
    const newUserStandings = { uid, wins, losses, sessions };

    const numberOfValues = Object.values(newUserStandings).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID, wins, losses, and sessions`
        }
      });
    };

    UserStandingsService.updateUserStandings(
        req.app.get('db'),
        req.params.stand_id,
        newUserStandings
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userStandingsRouter;