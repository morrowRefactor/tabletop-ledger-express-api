# Game Matches - Categories

A single game can match multiple categories.  Game Matches - Categories is a repository of every category that applies to each game.  When users log sessions, this information is used to track their progress toward earning categories badges.

## GET All Game Matches - Categories
**URL**: `/api/games-cat-matches`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "cat_id": 123,
    "game_id": 1
}
```

## Add New Game Matches - Categories

**URL**: `/api/games-cat-matches`  
**Method**: `POST`

**Data Example**
Provide a game ID and category ID.

```json
{
    "cat_id": 123,
    "game_id": 3
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "cat_id": 123,
    "game_id": 3
}
```

## Edit Existing Game Matches - Categories

**URL**: `/api/games-cat-matches/game-cat_id`  
**Method**: `PATCH`

**Data Example**
Provide a game ID and category ID.

```json
{
    "id": 2,
    "mech_id": 234,
    "game_id": 3
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "mech_id": 234,
    "game_id": 3
}
```

## Delete Existing Game Matches - Categories

**URL**: `/api/games-cat-matches/game-cat_id`  
**URL Parameters**: `game-cat_id=[integer]` where `game-cat_id` is the ID of the game category in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

