# Sessions

Session logs are used to track users' game sessions and include the primary data of the overall session, including the date, game played, and the user logging the session.

## GET All Sessions

**URL**: `/api/sessions`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 2,
    "game_id": 1,
    "uid": 2,
    "date": "2020-08-04",
    "name": "A session's nickname"
}
```

## Add New Session

**URL**: `/api/sessions`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and date  Optional: session name.

```json
{
    "game_id": 12345,
    "uid": 2,
    "date": "2020-08-25",
    "name": ""
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 10,
    "game_id": 12345,
    "uid": 2,
    "date": "2020-08-25",
    "name": ""
}
```

## Edit Existing Session

**URL**: `/api/sessions/session_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, game ID, and date. Optional: session name.

```json
{
    "id": 2,
    "game_id": 1,
    "uid": 2,
    "date": "2020-08-04",
    "name": "A new session name"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "game_id": 1,
    "uid": 2,
    "date": "2020-08-04",
    "name": "A new session name"
}
```

## Delete Existing Session

**URL**: `/api/sessions/sessions_id`  
**URL Parameters**: `session_id=[integer]` where `session_id` is the ID of the session in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

