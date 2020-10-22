const express = require('express');
const path = require('path');
const CatUserBadgesService = require('./user-badges-cat-service');

const userBadgesCatRouter = express.Router();
const jsonParser = express.json();

const serializeCatUserBadges = badge => ({
  id: badge.id,
  uid: badge.uid,
  badge_id: badge.badge_id
});

userBadgesCatRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    CatUserBadgesService.getAllCatUserBadges(knexInstance)
      .then(badge => {
        res.json(badge.map(serializeCatUserBadges))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { uid, badge_id } = req.body;
    const newUserCatBadge = { uid, badge_id };

    for (const [key, value] of Object.entries(newUserCatBadge))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    CatUserBadgesService.insertCatUserBadge(
      req.app.get('db'),
      newUserCatBadge
    )
      .then(badge => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${badge.id}`))
          .json(serializeCatUserBadges(badge));
      })
      .catch(next)
  });

userBadgesCatRouter
  .route('/:badge_id')
  .all((req, res, next) => {
    CatUserBadgesService.getById(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(badge => {
        if (!badge) {
          return res.status(404).json({
            error: { message: `User category badge doesn't exist` }
          })
        }
        res.badge = badge
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCatUserBadges(res.badge))
  })
  .delete((req, res, next) => {
    CatUserBadgesService.deleteCatUserBadge(
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
    const newUserCatBadge = { uid, badge_id };

    const numberOfValues = Object.values(newUserCatBadge).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a user ID and badge ID`
        }
      });
    };

    CatUserBadgesService.updateCatUserBadge(
        req.app.get('db'),
        req.params.badge_id,
        newUserCatBadge
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = userBadgesCatRouter;