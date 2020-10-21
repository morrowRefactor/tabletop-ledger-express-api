const express = require('express');
const path = require('path');
const MechUserBadgesService = require('./user-badges-mech-service');

const userBadgesMechRouter = express.Router();
const jsonParser = express.json();

const serializeMechUserBadges = badge => ({
  id: badge.id,
  uid: badge.uid,
  badge_id: badge.badge_id
});

userBadgesMechRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MechUserBadgesService.getAllMechUserBadges(knexInstance)
      .then(badge => {
        res.json(badge.map(serializeMechUserBadges))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { uid, badge_id } = req.body;
    const newUserMechBadge = { uid, badge_id };

    for (const [key, value] of Object.entries(newUserMechBadge))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    MechUserBadgesService.insertMechUserBadge(
      req.app.get('db'),
      newUserMechBadge
    )
      .then(badge => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${badge.id}`))
          .json(serializeMechUserBadges(badge));
      })
      .catch(next)
  });

userBadgesMechRouter
  .route('/:badge_id')
  .all((req, res, next) => {
    MechUserBadgesService.getById(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(badge => {
        if (!badge) {
          return res.status(404).json({
            error: { message: `User mech badge doesn't exist` }
          })
        }
        res.badge = badge
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeMechUserBadges(res.badge))
  })
  .delete((req, res, next) => {
    MechUserBadgesService.deleteMechUserBadge(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { uid, badge_id } = req.body;
    const newUserMechBadge = { uid, badge_id };

    const numberOfValues = Object.values(newUserMechBadge).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID and badge ID`
        }
      });
    };

    MechUserBadgesService.updateMechUserBadge(
        req.app.get('db'),
        req.params.badge_id,
        newUserMechBadge
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userBadgesMechRouter;