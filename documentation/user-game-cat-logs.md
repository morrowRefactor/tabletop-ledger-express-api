# User Game Logs - Categories

As users log game sessions they can work toward badges for certian game categories.  User Game Logs - Categories is a means tracking how many game each user has logged for a particular category.

## GET All User Game Logs - Categories
**URL**: `/api/user-game-cat-logs`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "cat_id": 123,
    "uid": 1,
    "sessions": 5
}
```

## Add New User Game Log - Categories

**URL**: `/api/user-game-cat-logs`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, category ID, and session count.

```json
{
    "cat_id": 234,
    "uid": 1,
    "sessions": 2
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "cat_id": 234,
    "uid": 1,
    "sessions": 2
}
```

## Edit Existing User Game Log - Categories

**URL**: `/api/user-game-cat-logs/user-log-cat_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, category ID, and session count.

```json
{
    "id": 2,
    "cat_id": 234,
    "uid": 1,
    "sessions": 3
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "cat_id": 234,
    "uid": 1,
    "sessions": 3
}
```

## Delete Existing User Game Log - Categories

**URL**: `/api/user-game-cat-logs/user-log-cat_id`  
**URL Parameters**: `user-log-cat_id=[integer]` where `user-log-cat_id` is the ID of the user's game category log in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

