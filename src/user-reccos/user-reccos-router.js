const express = require('express');
const xss = require('xss');
const path = require('path');
const UserReccosService = require('./user-reccos-service');

const userReccosRouter = express.Router();
const jsonParser = express.json();

const serializeUserRecco = recco => ({
  id: recco.id,
  uid: recco.uid,
  game_id: recco.game_id,
  recco_game_id: recco.recco_game_id,
  note: xss(recco.note)
});

userReccosRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserReccosService.getAllUserReccos(knexInstance)
      .then(recco => {
        res.json(recco.map(serializeUserRecco))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { uid, game_id, recco_game_id, note } = req.body;
    const newUserRecco = { uid, game_id, recco_game_id, note };
    const userReccoReqs = { uid, game_id, recco_game_id };

    for (const [key, value] of Object.entries(userReccoReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    UserReccosService.insertUserRecco(
      req.app.get('db'),
      newUserRecco
    )
      .then(recco => {
        console.log('recco res', recco)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recco.id}`))
          .json(serializeUserRecco(recco));
      })
      .catch(next)
  });

userReccosRouter
  .route('/:recco_id')
  .all((req, res, next) => {
    UserReccosService.getById(
      req.app.get('db'),
      req.params.recco_id
    )
      .then(recco => {
        if (!recco) {
          return res.status(404).json({
            error: { message: `User recco doesn't exist` }
          })
        }
        res.recco = recco
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserRecco(res.recco))
  })
  .delete((req, res, next) => {
    UserReccosService.deleteUserRecco(
      req.app.get('db'),
      req.params.recco_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { uid, game_id, recco_game_id, note } = req.body;
    const newUserRecco = { uid, game_id, recco_game_id, note };
    const userReccoReqs = { uid, game_id, recco_game_id };

    const numberOfValues = Object.values(userReccoReqs).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID, game ID, and recco game ID`
        }
      });
    };

    UserReccosService.updateUserRecco(
        req.app.get('db'),
        req.params.recco_id,
        newUserRecco
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userReccosRouter;