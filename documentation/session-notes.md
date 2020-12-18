# Session Notes

Session notes are a way for players to add context or reminders about a particular session.

## GET All Session Notes
**URL**: `/api/session-notes`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "session_id": 1,
    "uid": 1,
    "note": "I did X and it gave me an extra 20 points."
}
```

## Add New Session Notes

**URL**: `/api/session-notes`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a session ID, user ID, and note text.

```json
{
    "session_id": 1,
    "uid": 3,
    "note": "john had a great game. I missed my window of opportunity"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "session_id": 1,
    "uid": 3,
    "note": "john had a great game. I missed my window of opportunity"
}
```

## Edit Existing Session Notes

**URL**: `/api/session-notes/note_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a session ID, user ID, and note text.

```json
{
    "id": 2,
    "session_id": 1,
    "uid": 3,
    "note": "Updated note text"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "session_id": 1,
    "uid": 3,
    "note": "Updated note text"
}
```

## Delete Existing Session Note

**URL**: `/api/session-notes/note_id`  
**URL Parameters**: `note_id=[integer]` where `note_id` is the ID of the session note in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

