const express = require('express');
const xss = require('xss');
const path = require('path');
const MechBadgesService = require('./badges-mech-service');

const badgesMechRouter = express.Router();
const jsonParser = express.json();

const serializeMechBadges = badge => ({
  id: badge.id,
  name: xss(badge.name)
});

badgesMechRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MechBadgesService.getAllMechBadges(knexInstance)
      .then(badge => {
        res.json(badge.map(serializeMechBadges))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newMechBadge = { name };

    for (const [key, value] of Object.entries(newMechBadge))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    MechBadgesService.insertMechBadge(
      req.app.get('db'),
      newMechBadge
    )
      .then(badge => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${badge.id}`))
          .json(serializeMechBadges(badge));
      })
      .catch(next)
  });

badgesMechRouter
  .route('/:badge_id')
  .all((req, res, next) => {
    MechBadgesService.getById(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(badge => {
        if (!badge) {
          return res.status(404).json({
            error: { message: `Mech badge doesn't exist` }
          })
        }
        res.badge = badge
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeMechBadges(res.badge))
  })
  .delete((req, res, next) => {
    MechBadgesService.deleteMechBadge(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newMechBadge = { name };

    const numberOfValues = Object.values(newMechBadge).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a badge name`
        }
      });
    };

    MechBadgesService.updateMechBadge(
        req.app.get('db'),
        req.params.badge_id,
        newMechBadge
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = badgesMechRouter;