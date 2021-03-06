require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const gamesRouter = require('./games/games-router');
const sessionsRouter = require('./sessions/sessions-router');
const sessionPackageRouter = require('./session-package/session-package-router');
const sessionScoresRouter = require('./session-scores/session-scores-router');
const sessionNotesRouter = require('./session-notes/session-notes-router');
const userReccosRouter = require('./user-reccos/user-reccos-router');
const userGamesRouter = require('./user-games/user-games-router');
const gameTipsRouter = require('./game-tips/game-tips-router');
const badgesMechRouter = require('./badges-mech/badges-mech-router');
const badgesCatRouter = require('./badges-cat/badges-cat-router');
const badgeTiersRouter = require('./badge-tiers/badge-tiers-router');
const userMechBadgesRouter = require('./user-badges-mech/user-badges-mech-router');
const userCatBadgesRouter = require('./user-badges-cat/user-badges-cat-router');
const userStandingsRouter = require('./user-standings/user-standings-router');
const gamesMechRouter = require('./games-mech/games-mech-router');
const gamesCatRouter = require('./games-cat/games-cat-router');
const gamesCatMatchesRouter = require('./games-cat-matches/games-cat-matches-router');
const gamesMechMatchesRouter = require('./games-mech-matches/games-mech-matches-router');
const userGamesByCatLogsRouter = require('./user-game-cat-logs/user-game-cat-logs-router');
const userGamesByMechRouter = require('./user-game-mech-logs/user-game-mech-logs-router');
const authRouter = require('./auth/auth-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}));

app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/session-package', sessionPackageRouter);
app.use('/api/session-scores', sessionScoresRouter);
app.use('/api/session-notes', sessionNotesRouter);
app.use('/api/user-reccos', userReccosRouter);
app.use('/api/user-games', userGamesRouter);
app.use('/api/game-tips', gameTipsRouter);
app.use('/api/badges-mech', badgesMechRouter);
app.use('/api/badges-cat', badgesCatRouter);
app.use('/api/badge-tiers', badgeTiersRouter);
app.use('/api/user-badges-mech', userMechBadgesRouter);
app.use('/api/user-badges-cat', userCatBadgesRouter);
app.use('/api/user-standings', userStandingsRouter);
app.use('/api/games-mech', gamesMechRouter);
app.use('/api/games-cat', gamesCatRouter);
app.use('/api/games-cat-matches', gamesCatMatchesRouter);
app.use('/api/games-mech-matches', gamesMechMatchesRouter);
app.use('/api/user-game-cat-logs', userGamesByCatLogsRouter);
app.use('/api/user-game-mech-logs', userGamesByMechRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello, world')
});

app.use(function errorHandler(error, req, res, next) {
   let response;
   if (NODE_ENV === 'production') {
   response = { error: { message: 'server error' } }
     } else {
     console.error(error)
     response = { message: error.message, error }
   };
   res.status(500).json(response);
});

module.exports = app;