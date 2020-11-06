const express = require('express');
const xss = require('xss');
const path = require('path');
const CatBadgesService = require('./badges-cat-service');

const badgesCatRouter = express.Router();
const jsonParser = express.json();

const serializeCatBadges = badge => ({
  id: badge.id,
  cat_id: badge.cat_id,
  name: xss(badge.name)
});

badgesCatRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    CatBadgesService.getAllCatBadges(knexInstance)
      .then(badge => {
        res.json(badge.map(serializeCatBadges))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, cat_id } = req.body;
    const newCatBadge = { name, cat_id };

    for (const [key, value] of Object.entries(newCatBadge))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    CatBadgesService.insertCatBadge(
      req.app.get('db'),
      newCatBadge
    )
      .then(badge => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${badge.id}`))
          .json(serializeCatBadges(badge));
      })
      .catch(next)
  });

badgesCatRouter
  .route('/:badge_id')
  .all((req, res, next) => {
    CatBadgesService.getById(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(badge => {
        if (!badge) {
          return res.status(404).json({
            error: { message: `Category badge doesn't exist` }
          })
        }
        res.badge = badge
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCatBadges(res.badge))
  })
  .delete((req, res, next) => {
    CatBadgesService.deleteCatBadge(
      req.app.get('db'),
      req.params.badge_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, cat_id } = req.body;
    const newCatBadge = { name, cat_id };

    const numberOfValues = Object.values(newCatBadge).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a badge name and category id`
        }
      });
    };

    CatBadgesService.updateCatBadge(
        req.app.get('db'),
        req.params.badge_id,
        newCatBadge
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = badgesCatRouter;