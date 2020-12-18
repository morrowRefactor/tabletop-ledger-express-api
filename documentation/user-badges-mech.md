# User Badges - Mechanics

A repository of all the mechanics badges earned by users.

## GET All User Badges - Mechanics
**URL**: `/api/user-badges-mech`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "uid": 1,
    "badge_id": 123,
    "tier_id": 1
}
```

## Add New User Badge - Mechanic

**URL**: `/api/user-badges-mech`  
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

## Edit Existing User Badge - Mechanic

**URL**: `/api/user-badges-mech/mech_id`  
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

## Delete Existing User Badge - Mechanic

**URL**: `/api/user-badges-mech/mech_id`  
**URL Parameters**: `mech_id=[integer]` where `mech_id` is the ID of the user's mechanics badge in the database.  
**Method**: `DELETE`  
**Authorization**: `bearer JWTAuthToken`
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

