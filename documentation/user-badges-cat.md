# User Badges - Categories

A repository of all the categories badges earned by users.

## GET All User Badges - Categories
**URL**: `/api/user-badges-cat`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "badge_id": 123,
    "tier_id": 3
}
```

## Add New User Badge - Category

**URL**: `/api/user-badges-cat`  
**Method**: `POST`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, badge ID, and tier ID.

```json
{
    "uid": 1,
    "badge_id": 234,
    "tier_id": 1
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "uid": 1,
    "badge_id": 234,
    "tier_id": 1
}
```

## Edit Existing User Badge - Category

**URL**: `/api/user-badges-cat/cat_id`  
**Method**: `PATCH`
**Authorization**: `bearer JWTAuthToken`

**Data Example**
Provide a user ID, badge ID, and tier ID.

```json
{
    "id": 2,
    "uid": 1,
    "badge_id": 234,
    "tier_id": 2
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 2,
    "uid": 1,
    "badge_id": 234,
    "tier_id": 2
}
```

## Delete Existing User Badge - Category

**URL**: `/api/user-badges-cat/cat_id`  
**URL Parameters**: `cat_id=[integer]` where `cat_id` is the ID of the user's category badge in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

