const express = require('express');
const xss = require('xss');
const path = require('path');
const CatGamesService = require('./games-cat-service');

const gamesCatRouter = express.Router();
const jsonParser = express.json();

const serializeCatGames = game => ({
  id: game.id,
  cat_id: game.cat_id,
  name: xss(game.name)
});

gamesCatRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    CatGamesService.getAllCatGames(knexInstance)
      .then(game => {
        res.json(game.map(serializeCatGames))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const newGamesCat = req.body;
    let insertCount = 0;
    
    newGamesCat.forEach(game => {
      const { cat_id, name } = game;
      const gamesCatReqs = { cat_id, name };

      for (const [key, value] of Object.entries(gamesCatReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    })
    
    newGamesCat.forEach(game => {
      const gameCat = {
        cat_id: game.cat_id,
        name: game.name
      };

      CatGamesService.insertCatGame(
        req.app.get('db'),
        gameCat
      );

      insertCount++;
    });

    if(insertCount === newGamesCat.length) {
      return res
        .status(201).end()
    }
  });

gamesCatRouter
  .route('/:id')
  .all((req, res, next) => {
    CatGamesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(game => {
        if (!game) {
          return res.status(404).json({
            error: { message: `Game category doesn't exist` }
          })
        }
        res.game = game
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCatGames(res.game))
  })
  .delete((req, res, next) => {
    CatGamesService.deleteCatGame(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { cat_id, name } = req.body;
    const newCatGame = { cat_id, name };

    const numberOfValues = Object.values(newCatGame).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a category name and BGG ID`
        }
      });
    };

    CatGamesService.updateCatGame(
        req.app.get('db'),
        req.params.id,
        newCatGame
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = gamesCatRouter;