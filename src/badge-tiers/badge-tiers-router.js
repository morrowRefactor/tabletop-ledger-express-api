const express = require('express');
const xss = require('xss');
const path = require('path');
const BadgeTiersService = require('./badge-tiers-service');

const badgeTiersRouter = express.Router();
const jsonParser = express.json();

const serializeBadgeTiers = u => ({
  id: u.id,
  name: xss(u.name)
});

badgeTiersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BadgeTiersService.getAllBadgeTiers(knexInstance)
      .then(vid => {
        res.json(vid.map(serializeBadgeTiers))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newBadgeTier = { name };

    for (const [key, value] of Object.entries(newBadgeTier))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    BadgeTiersService.insertBadgeTier(
      req.app.get('db'),
      newBadgeTier
    )
      .then(tier => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tier.id}`))
          .json(serializeBadgeTiers(tier));
      })
      .catch(next)
  });

badgeTiersRouter
  .route('/:tier_id')
  .all((req, res, next) => {
    BadgeTiersService.getById(
      req.app.get('db'),
      req.params.tier_id
    )
      .then(tier => {
        if (!tier) {
          return res.status(404).json({
            error: { message: `Badge tier doesn't exist` }
          })
        }
        res.tier = tier
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBadgeTiers(res.tier))
  })
  .delete((req, res, next) => {
    BadgeTiersService.deleteBadgeTier(
      req.app.get('db'),
      req.params.tier_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const tierToUpdate = { name };

    const numberOfValues = Object.values(tierToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a badge tier name`
        }
      });
    };

    BadgeTiersService.updateBadgeTier(
        req.app.get('db'),
        req.params.tier_id,
        tierToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = badgeTiersRouter;