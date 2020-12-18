# Session Scores

Session scores log each player's score for a particular session and whether or not they were the winner.

## GET All Session Scores

**URL**: `/api/session-scores`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "session_id": 1,
    "game_id": 1,
    "uid": 2,
    "score": "100",
    "name": "Jane Doe",
    "winner": true
}
```

## Add New Session Scores

**URL**: `/api/session-scores`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a session ID, name, and game ID.  Optional: user ID, score, winner.  (Score values are not required for every session, such as win/loss games; this is managed by the front-end form validation)

```json
{
        "session_id": 1,
        "game_id": 1,
        "uid": null,
        "score": "85",
        "name": "Some Guy",
        "winner": false
    }
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "session_id": 1,
    "game_id": 1,
    "uid": null,
    "score": "85",
    "name": "Some Guy",
    "winner": false
}
```

## Edit Existing Session Scores

**URL**: `/api/session-scores/session-score_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a session ID, name, and game ID.  Optional: user ID, score, winner.

```json
{
    "id": 1,
    "session_id": 1,
    "game_id": 1,
    "uid": 2,
    "score": "133",
    "name": "Jane Doe",
    "winner": true
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 1,
    "session_id": 1,
    "game_id": 1,
    "uid": 2,
    "score": "133",
    "name": "Jane Doe",
    "winner": true
}
```

## Delete Existing Session Score

**URL**: `/api/session-scores/session-score_id`  
**URL Parameters**: `session-score_id=[integer]` where `session-score_id` is the ID of the session score in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

