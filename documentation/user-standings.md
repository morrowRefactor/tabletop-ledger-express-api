# User Standings

User standings tracks each player's session count, wins and losses.

## GET All User Standings
**URL**: `/api/user-standings`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "wins": 3,
    "losses": 1,
    "sessions": 4
}
```

## Add New User Standings

**URL**: `/api/user-standings`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, win count, loss count, and total session count.

```json
{
    "uid": 2,
    "wins": 1,
    "losses": 3,
    "sessions": 4
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "uid": 2,
    "wins": 1,
    "losses": 3,
    "sessions": 4
}
```

## Edit Existing User Standings

**URL**: `/api/user-standings/standing_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, win count, loss count, and total session count

```json
{
    "id": 2,
    "uid": 2,
    "wins": 2,
    "losses": 3,
    "sessions": 5
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "uid": 2,
    "wins": 2,
    "losses": 3,
    "sessions": 5
}
```

## Delete Existing User Standings

**URL**: `/api/user-standings/standing_id`  
**URL Parameters**: `standing_id=[integer]` where `standing_id` is the ID of the user's standings log in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

