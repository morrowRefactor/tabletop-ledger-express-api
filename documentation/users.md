# Users

Users can create profiles to utilize the site.  As users they can submit game sessions, add games, and earn rewards.

## GET All Users

**URL**: `/api/users`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "name": "John Doe",
    "about": "I am a gaming enthusiast",
    "joined_date": "2020-05-05"
}
```

## Add New User

**URL**: `/api/users`  
**Method**: `POST`

**Data Example**
Provide a user name, about info, password, and joined date.

```json
{
    "name": "Jane Doe",
    "about": "I am a gaming enthusiast",
    "password": "Password12!",
    "joined_date": "2020-01-04"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "id": 2,
    "name": "Jane Doe",
    "about": "I am a gaming enthusiast",
    "joined_date": "2020-01-04"
}
```

## Edit Existing User

**URL**: `/api/users/user_id`  
**Method**: `PATCH`

**Data Example**
Provide a user ID, name and/or about info.

```json
{
    "id": 1,
    "about": "Here's my updated about section"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 1,
    "name": "John Doe",
    "about": "Here's my updated about section",
    "joined_date": "2020-05-05"
}
```

## Delete Existing User

**URL**: `/api/users/user_id`  
**URL Parameters**: `user_id=[integer]` where `user_id` is the ID of the user in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

