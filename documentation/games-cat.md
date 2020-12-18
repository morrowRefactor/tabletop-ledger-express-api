# Game Categories

A repository of the the types of categories attributable to games.

## GET All Game Categories
**URL**: `/api/games-cat`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "cat_id": 123,
    "name": "Adventure"
}
```

## Add New Game Category

**URL**: `/api/games-cat`  
**Method**: `POST`

**Data Example**
Provide a category name and category ID.

```json
{
    "cat_id": 234,
    "name": "City Building"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "cat_id": 234,
    "name": "City Building"
}
```

## Edit Existing Game Category

**URL**: `/api/games-cat/cat_id`  
**Method**: `PATCH`

**Data Example**
Provide a category name and category ID.

```json
{
    "id": 2,
    "cat_id": 234,
    "name": "New category name"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "cat_id": 234,
    "name": "New category name"
}
```

## Delete Existing Game Category

**URL**: `/api/games-cat/cat_id`  
**URL Parameters**: `cat_id=[integer]` where `cat_id` is the ID of the game category in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

