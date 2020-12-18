# User Login

Users log into the app and receive an authentication tokem for their session.  Authentication is supported by JSON Web Tokens and data is protected with brcypt.js

## User Login

**URL**: `/api/auth/login`  
**Method**: `POST`

**Data Example**
Provide a user name and password.

```json
{
    "name": "John Doe",
    "password": "Password12!"
}
```

**Response Example**:  
**Code**: `200`

```json
{
    "authToken": "JWTAuthToken"
}
```