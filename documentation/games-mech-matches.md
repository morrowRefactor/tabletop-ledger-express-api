# Game Matches - Mechanics

A single game can match multiple mechanics.  Game Matches - Mechanics is a repository of every mechanic that applies to each game.  When users log sessions, this information is used to track their progress toward earning mechanics badges.

## GET All Game Matches - Mechanics
**URL**: `/api/games-mech-matches`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "mech_id": 123,
    "game_id": 1
}
```

## Add New Game Matches - Mechanics

**URL**: `/api/games-mech-matches`  
**Method**: `POST`

**Data Example**
Provide a game ID and mechanic ID.

```json
{
    "mech_id": 123,
    "game_id": 2
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "mech_id": 123,
    "game_id": 2
}
```

## Edit Existing Game Matches - Mechanics

**URL**: `/api/games-mech-matches/game-mech_id`  
**Method**: `PATCH`

**Data Example**
Provide a game ID and mechanic ID.

```json
{
    "id": 2,
    "mech_id": 234,
    "game_id": 2
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "mech_id": 234,
    "game_id": 2
}
```

## Delete Existing Game Matches - Mechanics

**URL**: `/api/games-mech-matches/game-mech_id`  
**URL Parameters**: `game-mech_id=[integer]` where `game-mech_id` is the ID of the game mechanic in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

