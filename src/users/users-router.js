const express = require('express');
const xss = require('xss');
const path = require('path');
const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUsers = u => ({
  id: u.id,
  name: xss(u.name),
  about: xss(u.about),
  joined_date: u.joined_date.toISOString().substr(0,10)
});

const serializeNewUser = u => ({
  id: u.id,
  name: xss(u.name),
  about: xss(u.about),
  joined_date: u.joined_date.toISOString().substr(0,10),
  authToken: u.authToken
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
    const userReqs = { name, password };

    for (const [key, value] of Object.entries(userReqs))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    const passwordError = UsersService.validatePassword(password);
    if (passwordError)
      return res.status(400).json({ error: passwordError });

    

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })
    
          return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              name,
              password: hashedPassword,
              about,
              joined_date
            };

            UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                const sub = user.name;
                const payload = { user_id: user.id };
                const authToken = AuthService.createJwt(sub, payload);
                user.authToken = authToken;
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`)) 
                  .json(serializeNewUser(user));
              })
            })
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