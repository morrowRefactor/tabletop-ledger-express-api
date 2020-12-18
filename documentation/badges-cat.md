# Badges - Categories

A repository of the game categories for which users can earn badges.

## GET All Badges - Categories
**URL**: `/api/badges-cat`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 4,
    "name": "City building beginner"
}
```

## Add New Badge - Categories

**URL**: `/api/badges-cat`  
**Method**: `POST`

**Data Example**
Provide a badge name for the game category.

```json
{
    "name": "Adventure beginner"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 1,
    "name": "Adventure beginner"
}
```

## Edit Existing Badge - Categories

**URL**: `/api/badges-cat/badge_id`  
**Method**: `PATCH`

**Data Example**
Provide a badge name for the game category.

```json
{
    "id": 4,
    "name": "New badge category title"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 4,
    "name": "New badge category title"
}
```

## Delete Existing Badge - Categories

**URL**: `/api/badges-cat/badge_id`  
**URL Parameters**: `badge_id=[integer]` where `badge_id` is the ID of the badge category in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

