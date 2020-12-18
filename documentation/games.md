# Games

The tabletop games available in the TTL database.  Users reference these games when logging sessions and adding them to their personal lists.  Users can also add new games using a BoardGameGeek API.

## GET All Games

**URL**: `/api/games`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
    "id": 1,
    "title": "Gloomhaven",
    "description": "Gloomhaven  is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world.",
    "image": "https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg",
    "bgg_id": 174430,
    "bgg_rating": "8.2"
}
```

## Add New Game

**URL**: `/api/games`  
**Method**: `POST`

**Data Example**
Provide a game title, description, image, BoardGameGeek rating, and BoardGameGeek ID (the React client populates all these fields when users submit a new game).

```json
{
    "title": "Last Bastion",
    "description": "A handful of heroes have just stolen the powerful relics of the Baleful Queen. Without them, the immortal sovereign is weakened; recovering them is now her sole purpose.",
    "image": "https://cf.geekdo-images.com/original/img/JKYwSt8a2tcBYG20Oom7Rebth_Y=/0x0/pic4882123.png",
    "bgg_id": 285984,
    "bgg_rating": "8.1"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
    "title": "Last Bastion",
    "description": "A handful of heroes have just stolen the powerful relics of the Baleful Queen. Without them, the immortal sovereign is weakened; recovering them is now her sole purpose.",
    "image": "https://cf.geekdo-images.com/original/img/JKYwSt8a2tcBYG20Oom7Rebth_Y=/0x0/pic4882123.png",
    "bgg_id": 285984,
    "bgg_rating": "8.1"
}
```

## Edit Existing Game

**URL**: `/api/games/game_id`  
**Method**: `PATCH`

**Data Example**
Provide a game title, description, image, BoardGameGeek rating, and BoardGameGeek ID.

```json
{
    "id": 1,
    "title": "Gloomhaven",
    "description": "Here's updated content.  This game is about XYZ",
    "image": "https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg",
    "bgg_id": 174430,
    "bgg_rating": "8.2"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
    "id": 1,
    "title": "Gloomhaven",
    "description": "Here's updated content.  This game is about XYZ",
    "image": "https://cf.geekdo-images.com/original/img/lDN358RgcYvQfYYN6Oy2TXpifyM=/0x0/pic2437871.jpg",
    "bgg_id": 174430,
    "bgg_rating": "8.2"
}
```

## Delete Existing Game

**URL**: `/api/games/game_id`  
**URL Parameters**: `game_id=[integer]` where `game_id` is the ID of the game in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

