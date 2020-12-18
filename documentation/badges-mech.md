# Badges - Mechanics

A repository of the game mechanics for which users can earn badges.

## GET All Badges - Mechanics
**URL**: `/api/badges-mech`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "name": "Co-op beginner"
}
```

## Add New Badge - Mechanics

**URL**: `/api/badges-mech`  
**Method**: `POST`

**Data Example**
Provide a badge name for the game mechanic.

```json
{
    "name": "Dungeon crawl beginner"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 4,
    "name": "Dungeon crawl beginner"
}
```

## Edit Existing Badge - Mechanics

**URL**: `/api/badges-mech/badge_id`  
**Method**: `PATCH`

**Data Example**
Provide a badge name for the game mechanic.

```json
{
    "id": 4,
    "name": "New badge mechanic title"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 4,
    "name": "New badge mechanic title"
}
```

## Delete Existing Badge - Mechanics

**URL**: `/api/badges-mech/badge_id`  
**URL Parameters**: `badge_id=[integer]` where `badge_id` is the ID of the badge mechanic in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

