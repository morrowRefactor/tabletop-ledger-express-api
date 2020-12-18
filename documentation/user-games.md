# User Games

Users can add games to their profiles as a way to view their sessions for a particular game, their own rating of a game, their own notes, and whether they own the game.

## GET All User Games
**URL**: `/api/user-games`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "game_id": 1,
    "own": true,
    "favorite": 1,
    "rating": "9.0",
    "notes": "My favorite game of all time"
}
```

## Add New User Game

**URL**: `/api/user-games`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, and game ID.  Optional: a favorite rank value, numeric rating value, a true/false ownership value, or game notes.

```json
{
    "uid": 1,
    "game_id": 3,
    "own": true,
    "favorite": 2,
    "rating": "8.6",
    "notes": ""
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "uid": 1,
    "game_id": 3,
    "own": true,
    "favorite": 2,
    "rating": "8.6",
    "notes": ""
}
```

## Edit Existing User Game

**URL**: `/api/user-games/game_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, and game ID.  Optional: a favorite rank value, numeric rating value, a true/false ownership value, or game notes.

```json
{
    "id": 2,
    "uid": 1,
    "game_id": 3,
    "own": true,
    "favorite": 2,
    "rating": "8.6",
    "notes": "A new note for this game"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "uid": 1,
    "game_id": 3,
    "own": true,
    "favorite": 2,
    "rating": "8.6",
    "notes": "A new note for this game"
}
```

## Delete Existing User Game

**URL**: `/api/user-games/game_id`  
**URL Parameters**: `game_id=[integer]` where `game_id` is the ID of the user game in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

