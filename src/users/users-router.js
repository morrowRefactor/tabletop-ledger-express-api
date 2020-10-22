const express = require('express');
const xss = require('xss');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUsers = u => ({
  id: u.id,
  name: xss(u.name),
  about: xss(u.about),
  password: xss(u.password),
  joined_date: u.joined_date.toISOString().substr(0,10)
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UsersService.getAllUsers(knexInstance)
      .then(vid => {
        res.json(vid.map(serializeUsers))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, about, password, joined_date } = req.body;
    const newUser = { name, about, password, joined_date };
    const userReqs = { name, password };

    for (const [key, value] of Object.entries(userReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    UsersService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUsers(user));
      })
      .catch(next)
  });

usersRouter
  .route('/:uid')
  .all((req, res, next) => {
    UsersService.getById(
      req.app.get('db'),
      req.params.uid
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUsers(res.user))
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.uid
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, about, password, joined_date } = req.body;
    const userToUpdate = { name, about, password, joined_date };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a name, password, or about section`
        }
      });
    };

    UsersService.updateUser(
        req.app.get('db'),
        req.params.uid,
        userToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = usersRouter;