const express = require('express');
const SessionPackageService = require('./session-package-service');
const { requireAuth } = require('../middleware/jwt-auth');

const sessionPackageRouter = express.Router();
const jsonParser = express.json();

sessionPackageRouter
  .route('/')
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { hostStats, notes, scores, newCatLogs, newMechLogs, updateCatLogs, updateMechLogs, newCatBadges, updateCatBadges, newMechBadges, updateMechBadges } = req.body;
    
    // check for missing data
    const numberOfValues = Object.values(hostStats).filter(Boolean).length;
      if (numberOfValues === 0) {
          return res.status(400).json({
          error: {
            message: `Host user standings must contain a user ID, wins, losses, and sessions`
          }
        });
    };

    scores.forEach(sess => {
        const { session_id, game_id, name, winner } = sess;
        const sessionScoreReqs = { session_id, game_id, name, winner };
  
        for (const [key, value] of Object.entries(sessionScoreReqs))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
        });
      });

    if(notes) {
        for (const [key, value] of Object.entries(notes))
            if (value == null)
                return res.status(400).json({
                error: { message: `Missing '${key}' in notes request body` }
        });
    }

    if(newCatLogs) {
        newCatLogs.forEach(log => {
            const { cat_id, uid, sessions } = log;
            const userGameCatLogsReqs = { cat_id, uid, sessions };
      
            for (const [key, value] of Object.entries(userGameCatLogsReqs))
              if (value == null)
                return res.status(400).json({
                  error: { message: `Missing '${key}' in new category request body` }
                });
        });
    }

    if(newMechLogs) {
        newMechLogs.forEach(log => {
            const { mech_id, uid, sessions } = log;
            const userGameMechLogsReqs = { mech_id, uid, sessions };
      
            for (const [key, value] of Object.entries(userGameMechLogsReqs))
              if (value == null)
                return res.status(400).json({
                  error: { message: `Missing '${key}' in user game mechanics request body` }
                });
        })
    }

    if(updateCatLogs) {
      updateCatLogs.forEach(log => {
          const numberOfValues = Object.values(log).filter(Boolean).length;
          if (numberOfValues === 0) {
              return res.status(400).json({
                  error: {
                  message: `Update user category logs must contain a user ID, category ID, and session number`
              }
          });
          };
      })
    }

    if(updateMechLogs) {
      updateMechLogs.forEach(log => {
          const numberOfValues = Object.values(log).filter(Boolean).length;
          if (numberOfValues === 0) {
              return res.status(400).json({
                  error: {
                  message: `User mechanics log must contain a user ID, mechanic ID, and session number`
                  }
              });
          };
      })
    }

    if(newCatBadges) {
      newCatBadges.forEach(badge => {
        for (const [key, value] of Object.entries(badge))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in new category badges request body` }
          });
      })
    }

    if(newMechBadges) {
      newMechBadges.forEach(badge => {
        for (const [key, value] of Object.entries(badge))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in new mechanic badges request body` }
          });
      })
    }

    if(updateCatBadges) {
      updateCatBadges.forEach(badge => {
        const numberOfValues = Object.values(badge).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
            error: {
              message: `Update category badge request body must contain a user ID, badge ID, and badge tier ID`
            }
          });
        };
      })
    }

    if(updateMechBadges) {
      updateMechBadges.forEach(badge => {
        const numberOfValues = Object.values(badge).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
            error: {
              message: `Update mechanic badge request body must contain a user ID, badge ID, and badge tier ID`
            }
          });
        };
      })
    }

    // insert session notes if present
    if(notes) {
        SessionPackageService.insertNote(
            req.app.get('db'),
            notes
        );
    }

    // update user category and mechanics logs
    if(newCatLogs) {
        newCatLogs.forEach(log => {
            const newUserGameCatLog = {
              cat_id: log.cat_id,
              uid: log.uid,
              sessions: log.sessions
            };
      
            SessionPackageService.insertUserGameCatLog(
              req.app.get('db'),
              newUserGameCatLog
            );
        });
    }

    if(newMechLogs) {
        newMechLogs.forEach(log => {
            const newUserGameMechLog = {
              mech_id: log.mech_id,
              uid: log.uid,
              sessions: log.sessions
            };
      
            SessionPackageService.insertUserGameMechLog(
              req.app.get('db'),
              newUserGameMechLog
            );
        });
    }

    if(updateCatLogs) {
      updateCatLogs.forEach(log => {
        SessionPackageService.updateUserGameCatLog(
            req.app.get('db'),
            log.id,
            log
        )
        .then(numRowsAffected => {
        })
        .catch(next);
      })
    }

    if(updateMechLogs) {
      updateMechLogs.forEach(log => {
        SessionPackageService.updateUserGameMechLog(
            req.app.get('db'),
            log.id,
            log
        )
        .then(numRowsAffected => {
        })
        .catch(next);
      })
    }

    // update user badge data
    if(newCatBadges) {
      newCatBadges.forEach(badge => {
        SessionPackageService.insertCatUserBadge(
          req.app.get('db'),
          badge
        )
        .then(badge => {
        })
        .catch(next)
      })
    }

    if(newMechBadges) {
      newMechBadges.forEach(badge => {
        SessionPackageService.insertMechUserBadge(
          req.app.get('db'),
          badge
        )
        .then(badge => {
        })
        .catch(next)
      })
    }

    if(updateCatBadges) {
      updateCatBadges.forEach(badge => {
        SessionPackageService.updateCatUserBadge(
          req.app.get('db'),
          badge.id,
          badge
        )
        .then(numRowsAffected => {
        })
        .catch(next)
      })
    }

    if(updateMechBadges) {
      updateMechBadges.forEach(badge => {
        SessionPackageService.updateMechUserBadge(
          req.app.get('db'),
          badge.id,
          badge
        )
        .then(numRowsAffected => {
        })
        .catch(next)
      })
    }

    // update user standings
    SessionPackageService.updateUserStandings(
        req.app.get('db'),
        hostStats.id,
        hostStats
    )
    .then(numRowsAffected => {
    })
    .catch(next);

    // insert session scores and send response
    let insertCount = 0;

    scores.forEach(sess => {
      const sessScore = {
        session_id: sess.session_id,
        game_id: sess.game_id,
        uid: sess.uid,
        score: sess.score,
        name: sess.name,
        winner: sess.winner
      };

      SessionPackageService.insertScores(
        req.app.get('db'),
        sessScore
      );

      insertCount++;
    });

    if(insertCount === scores.length) {
      return res
        .status(201)
        .end()
    }
  });

module.exports = sessionPackageRouter;