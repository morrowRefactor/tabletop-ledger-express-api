# TableTop Ledger

This backend API supports CRUD operations for the React app TableTop Ledger - an app for board game enthusiasts to log their game sessions to improve their stats and climb leaderboards.

The live app can be viewed here: https://tabletop-ledger.vercel.app/

The front-end client can be viewed here: https://github.com/morrowRefactor/tabletop-ledger-react-client

## Technology

* Node and Express
  * RESTful Api
* Testing
  * Supertest (integration)
  * Mocha and Chai (unit)
* Database
  * Postgres
  * Knex.js - SQL wrapper
* Data Protection
  * Brcypt.js

#### Production

Deployed via Heroku

## Open Endpoints

Account creation and user login

[User Registration](documentation/users.md): `POST /api/users`
[User Login](documentation/auth-login.md): `POST /api/auth/login`


All GET endpoints are open, no authentication required.

[Games](documentation/games.md): `GET /api/games`  
[Users](documentation/users.md): `GET /api/users` 
[Sessions](documentation/sessions.md): `GET /api/sessions`  
[Session Scores](documentation/session-scores.md): `GET /api/session-scores`
[Session Notes](documentation/session-notes.md): `GET /api/session-notes`
[User Standings](documentation/user-standings.md): `GET /api/user-standings`
[User Game Recommendations](documentation/user-reccos.md): `GET /api/user-reccos`
[User Games](documentation/user-games.md): `GET /api/user-games`
[User Game Tips](documentation/game-tips.md): `GET /api/game-tips`
[Badges - Mechanics](documentation/badges-mech.md): `GET /api/badges-mech`
[Badges - Categories](documentation/badges-cat.md): `GET /api/badges-cat`
[Badge Tiers](documentation/badge-tiers.md): `GET /api/badge-tiers`
[Game Mechanics](documentation/games-mech.md): `GET /api/games-mech`
[Game Categories](documentation/games-cat.md): `GET /api/games-cat`
[User Badges - Mechanics](documentation/user-badges-mech.md): `GET /api/user-badges-mech`
[User Badges - Categories](documentation/user-badges-cat.md): `GET /api/user-badges-cat`
[Game Mechanic Matches](documentation/games-mech-matches.md): `GET /api/games-mech-matches`
[Game Category Matches](documentation/games-cat-matches.md): `GET /api/games-cat-matches`
[User Game Logs - Mechanics](documentation/user-game-mech-logs.md): `GET /api/user-game-mech-logs`
[User Game Logs - Categories](documentation/user-game-cat-logs.md): `GET /api/user-game-cat-logs`

### Add Content

[Add Badges - Mechanics](documentation/badges-mech.md): `POST /api/badges-mech`
[Add Badges - Categories](documentation/badges-cat.md): `POST /api/badges-cat`
[Add Badge Tiers](documentation/badge-tiers.md): `POST /api/badge-tiers`
[Add Game Mechanics](documentation/games-mech.md): `POST /api/games-mech`
[Add Game Categories](documentation/games-cat.md): `POST /api/games-cat`
[Add Game Mechanic Matches](documentation/games-mech-matches.md): `POST /api/games-mech-matches`
[Add Game Category Matches](documentation/games-cat-matches.md): `POST /api/games-cat-matches`


### Edit Content

[Edit Badges - Mechanics](documentation/badges-mech.md): `PATCH /api/badges-mech`
[Edit Badges - Categories](documentation/badges-cat.md): `PATCH /api/badges-cat`
[Edit Badge Tiers](documentation/badge-tiers.md): `PATCH /api/badge-tiers`
[Edit Game Mechanics](documentation/games-mech.md): `PATCH /api/games-mech`
[Edit Game Categories](documentation/games-cat.md): `PATCH /api/games-cat`
[Edit Game Mechanic Matches](documentation/games-mech-matches.md): `PATCH /api/games-mech-matches`
[Edit Game Category Matches](documentation/games-cat-matches.md): `PATCH /api/games-cat-matches`


### Remove Content

[Remove Badges - Mechanics](documentation/badges-mech.md): `DELETE /api/badges-mech`
[Remove Badges - Categories](documentation/badges-cat.md): `DELETE /api/badges-cat`
[Remove Badge Tiers](documentation/badge-tiers.md): `DELETE /api/badge-tiers`
[Remove Game Mechanics](documentation/games-mech.md): `DELETE /api/games-mech`
[Remove Game Categories](documentation/games-cat.md): `DELETE /api/games-cat`
[Remove Game Mechanic Matches](documentation/games-mech-matches.md): `DELETE /api/games-mech-matches`
[Remove Game Category Matches](documentation/games-cat-matches.md): `DELETE /api/games-cat-matches`


## Protected Endpoints

### Add Content

[Add Games](documentation/games.md): `POST /api/games`  
[Add Session](documentation/sessions.md): `POST /api/sessions`  
[Add Session Scores](documentation/session-scores.md): `POST /api/session-scores`
[Add Session Notes](documentation/session-notes.md): `POST /api/session-notes`
[Add User Standings](documentation/user-standings.md): `POST /api/user-standings`
[Add User Game Recommendations](documentation/user-reccos.md): `POST /api/user-reccos`
[Add User Games](documentation/user-games.md): `POST /api/user-games`
[Add Game Tips](documentation/game-tips.md): `POST /api/game-tips`
[Add User Badges - Mechanics](documentation/user-badges-mech.md): `POST /api/user-badges-mech`
[Add User Badges - Categories](documentation/user-badges-cat.md): `POST /api/user-badges-cat`
[Add User Game Logs - Mechanics](documentation/user-game-mech-logs.md): `POST /api/user-game-mech-logs`
[Add User Game Logs - Categories](documentation/user-game-cat-logs.md): `POST /api/user-game-cat-logs`


### Edit Content

[Edit Games](documentation/games.md): `PATCH /api/games`  
[Edit User Profile](documentation/users.md): `PATCH /api/users`
[Edit Session](documentation/sessions.md): `PATCH /api/sessions`
[Edit Session Scores](documentation/session-scores.md): `PATCH /api/session-scores` 
[Edit Session Notes](documentation/session-notes.md): `PATCH /api/session-notes`
[Edit User Standings](documentation/user-standings.md): `PATCH /api/user-standings`
[Edit User Game Recommendations](documentation/user-reccos.md): `PATCH /api/user-reccos`
[Edit User Games](documentation/user-games.md): `PATCH /api/user-games`
[Edit Game Tips](documentation/game-tips.md): `PATCH /api/game-tips`
[Edit User Badges - Mechanics](documentation/user-badges-mech.md): `PATCH /api/user-badges-mech`
[Edit User Badges - Categories](documentation/user-badges-cat.md): `PATCH /api/user-badges-cat`
[Edit User Game Logs - Mechanics](documentation/user-game-mech-logs.md): `PATCH /api/user-game-mech-logs`
[Edit User Game Logs - Categories](documentation/user-game-cat-logs.md): `PATCH /api/user-game-cat-logs`


### Remove Content

[Remvoe Games](documentation/games.md): `DELETE /api/games` 
[Delete User Profile](documentation/users.md): `DELETE /api/users`
[Remove Session](documentation/sessions.md): `DELETE /api/sessions` 
[Remove Session Scores](documentation/session-scores.md): `DELETE /api/session-scores`
[Remove Session Notes](documentation/session-notes.md): `DELETE /api/session-notes`
[Remove User Standings](documentation/user-standings.md): `DELETE /api/user-standings`
[Remove User Game Recommendations](documentation/user-reccos.md): `DELETE /api/user-reccos`
[Remvoe User Games](documentation/user-games.md): `DELETE /api/user-games`
[Remove Game Tips](documentation/game-tips.md): `DELETE /api/game-tips`
[Remvoe User Badges - Mechanics](documentation/user-badges-mech.md): `DELETE /api/user-badges-mech`
[Remvoe User Badges - Categories](documentation/user-badges-cat.md): `DELETE /api/user-badges-cat`
[Remove User Game Logs - Mechanics](documentation/user-game-mech-logs.md): `DELETE /api/user-game-mech-logs`
[Remove User Game Logs - Categories](documentation/user-game-cat-logs.md): `DELETE /api/user-game-cat-logs`


## Scripts 

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Quick App Preview
Homepage:

![screenshotDescription](https://user-images.githubusercontent.com/58446465/101947814-e99daf00-3ba5-11eb-929d-30f7ec8db1b2.png)

Browsing Games: Users can browse games as well as add them to the TTL database.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/101947812-e9051880-3ba5-11eb-8301-7ac38fccd35f.png)

Climb Leaderboards: As users log more games they can improve their standings in the community leaderboards.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/101947816-e99daf00-3ba5-11eb-9601-717a9534fb47.png)

Creating Profiles: Users can create accounts to log their sessions and monitor their progress.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/101947818-e99daf00-3ba5-11eb-88e5-f001c6fa876b.png)

Logging Sessions: A key aspect of TTL is logging game sessions so users can track their progress and earn badges.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/101947820-ea364580-3ba5-11eb-972a-1a3a28f6ce73.png)