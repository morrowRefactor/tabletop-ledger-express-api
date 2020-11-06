const express = require('express');
const xss = require('xss');
const path = require('path');
const SessionNotesService = require('./session-notes-service');

const sessionNotesRouter = express.Router();
const jsonParser = express.json();

const serializeSessionNote = sess => ({
  id: sess.id,
  session_id: sess.session_id,
  uid: sess.uid,
  note: xss(sess.note)
});

sessionNotesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    SessionNotesService.getAllNotes(knexInstance)
      .then(sess => {
        res.json(sess.map(serializeSessionNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { session_id, uid, note } = req.body;
    const newSessionNote = { session_id, uid, note };

    for (const [key, value] of Object.entries(newSessionNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    SessionNotesService.insertNote(
      req.app.get('db'),
      newSessionNote
    )
      .then(sess => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${sess.id}`))
          .json(serializeSessionNote(sess));
      })
      .catch(next)
  });

sessionNotesRouter
  .route('/:sess_id')
  .all((req, res, next) => {
    SessionNotesService.getById(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(sess => {
        if (!sess) {
          return res.status(404).json({
            error: { message: `Session notes don't exist` }
          })
        }
        res.sess = sess
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSessionNote(res.sess))
  })
  .delete((req, res, next) => {
    SessionNotesService.deleteNote(
      req.app.get('db'),
      req.params.sess_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { session_id, uid, note } = req.body;
    const noteToUpdate = { session_id, uid, note };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a session ID, user ID, and note`
        }
      });
    };

    SessionNotesService.updateNote(
        req.app.get('db'),
        req.params.sess_id,
        noteToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  });

module.exports = sessionNotesRouter;