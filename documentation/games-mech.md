# Game Mechanics

A repository of the the types of mechanics attributable to games.

## GET All Game Mechanics
**URL**: `/api/games-mech`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "mech_id": 123,
    "name": "Cooperative"
}
```

## Add New Game Mechanic

**URL**: `/api/games-mech`  
**Method**: `POST`

**Data Example**
Provide a mechanic name and mechanic ID.

```json
{
    "mech_id": 234,
    "name": "Dungeon Crawler"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "mech_id": 234,
    "name": "Dungeon Crawler"
}
```

## Edit Existing Game Mechanic

**URL**: `/api/games-mech/mech_id`  
**Method**: `PATCH`

**Data Example**
Provide a mechanic name and mechanic ID.

```json
{
    "id": 2,
    "mech_id": 234,
    "name": "New mechanic name"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "mech_id": 234,
    "name": "New mechanic name"
}
```

## Delete Existing Game Mechanic

**URL**: `/api/games-mech/mech_id`  
**URL Parameters**: `mech_id=[integer]` where `mech_id` is the ID of the game mechanic in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

