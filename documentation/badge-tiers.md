# Badges Tiers

A repository of the tier levels of badges that users can earn (typically ranging from "beginner" to "expert").

## GET All Badge Tiers
**URL**: `/api/badge-tiers`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "name": "Beginner"
}
```

## Add New Badg Tier

**URL**: `/api/badge-tiers`  
**Method**: `POST`

**Data Example**
Provide a badge tier name.

```json
{
    "name": "Expert"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 3,
    "name": "Expert"
}
```

## Edit Existing Badge Tier

**URL**: `/api/badges-tiers/tier_id`  
**Method**: `PATCH`

**Data Example**
Provide a badge tier name.

```json
{
    "id": 4,
    "name": "New badge tier title"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 4,
    "name": "New badge tier title"
}
```

## Delete Existing Badge Tier

**URL**: `/api/badges-tiers/tier_id`  
**URL Parameters**: `tier_id=[integer]` where `tier_id` is the ID of the badge tier in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

