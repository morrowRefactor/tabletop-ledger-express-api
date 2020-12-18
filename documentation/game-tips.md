# Game Tips

Users can post tips and suggestions for particular games as means of sharing strategy.

## GET All Game Tips
**URL**: `/api/game-tips`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "game_id": 1,
    "tip": "Always do X before Y"
}
```

## Add New Game Tip

**URL**: `/api/game-tips`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and tip text.

```json
{
    "uid": 3,
    "game_id": 1,
    "tip": "Never do X.  Bad idea"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 1,
    "tip": "Never do X.  Bad idea"
}
```

## Edit Existing Game Tip

**URL**: `/api/game-tips/tip_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and tip text.

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 1,
    "tip": "Updated tip text"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 1,
    "tip": "Updated tip text"
}
```

## Delete Existing User Game

**URL**: `/api/game-tips/tip_id`  
**URL Parameters**: `tip_id=[integer]` where `tip_id` is the ID of the game tip in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

