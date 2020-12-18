# User Game Logs - Mechanics

As users log game sessions they can work toward badges for certian game mechanics.  User Game Logs - Mechanics is a means tracking how many game each user has logged for a particular mechanic.

## GET All User Game Logs - Mechanics
**URL**: `/api/user-game-mech-logs`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "mech_id": 123,
    "uid": 1,
    "sessions": 4
}
```

## Add New User Game Log - Mechanics

**URL**: `/api/user-game-mech-logs`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, mechanic ID, and session count.

```json
{
    "mech_id": 234,
    "uid": 1,
    "sessions": 6
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "mech_id": 234,
    "uid": 1,
    "sessions": 6
}
```

## Edit Existing User Game Log - Mechanics

**URL**: `/api/user-game-mech-logs/user-log-mech_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, mechanic ID, and session count.

```json
{
    "id": 2,
    "mech_id": 234,
    "uid": 1,
    "sessions": 10
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "mech_id": 234,
    "uid": 1,
    "sessions": 10
}
```

## Delete Existing User Game Log - Mechanics

**URL**: `/api/user-game-mech-logs/user-log-mech_id`  
**URL Parameters**: `user-log-mech_id=[integer]` where `user-log-mech_id` is the ID of the user's game mechanic log in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

