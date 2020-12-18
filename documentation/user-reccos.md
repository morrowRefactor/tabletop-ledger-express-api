# User Game Recommendations

User recommendations are a way for members to suggest a game based on another similar game.

## GET All User Recommendations
**URL**: `/api/user-reccos`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "game_id": 1,
    "recco_game_id": 7,
    "note": "If you love Gloomhaven, I highly recommend Mechs vs Minions."
}
```

## Add New User Recommendation

**URL**: `/api/user-reccos`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and ID of the game being recommended.  Optional: a user note.

```json
{
    "uid": 3,
    "game_id": 3,
    "recco_game_id": 4,
    "note": "If you love Nemesis, I highly recommend Carcassonne."
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 3,
    "recco_game_id": 4,
    "note": "If you love Nemesis, I highly recommend Carcassonne."
}
```

## Edit Existing User Recommendation

**URL**: `/api/user-reccos/recco_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and ID of the game being recommended.  Optional: a user note.

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 3,
    "recco_game_id": 4,
    "note": "Some new text for this recco"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "uid": 3,
    "game_id": 3,
    "recco_game_id": 4,
    "note": "Some new text for this recco"
}
```

## Delete Existing User Recommendation

**URL**: `/api/user-reccos/recco_id`  
**URL Parameters**: `recco_id=[integer]` where `recco_id` is the ID of the user recommendation in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

