# Cryptocurrency Portfolio Management System

## Back-end Files

- **app.py**:
  This contains the portfolio's entry point router function. And also contains the CORS (Cross-Origin Resource Sharing) configuration.

- **db_config.py**:
  This contains the database configuration.

- **models.py**:
  This contains the User model for `users` database table and Token model for the `tokens` database table.

- **oauth.py**:
  This contains the OAuth `BasicAuth` class for basic authentication and `OAuth2PasswordBearerCookie` class for token bearer authentication.

- **routes.py**:
  This contains all the APIs endpoints for the cryptocurrency portfolio system.
  The endpoints are explained below in the APIs Endpoints section.

- **schemas.py**:
  This contains all the schemas for the portfolio system for data validation.

- **settings.py**:
  This contains all the base environment settings for the portfolio system.
  And this settings must be met before the portfolio system is started else the system will throw ValidationError exception.

- **utils.py**:
  This contains all the utilities for the portfolio system such as `hash_pwd` for password hashing and `verify_pwd` for password verification.


## Cryptocurrency Portfolio APIs V1 Endpoints

- ``/portfolio/v1/users``:
  List all the users in the portfolio database.
  METHOD: GET
  `RETURN`: returns at least one user else returns `No users found` message.

- ``/portfolio/v1/users/{user_id}``:
  List all the user's data.
  METHOD: GET
  PARAMETER: user_id (uuid): the user's unique identifier
  RETURN: returns user's data else returns `User not found` message

- ``/portfolio/v1/users/{user_id}/update``:
  Update user's data in the portfolio database.
  METHOD: PUT
  PARAMETER: user_id (uuid): the user's unique identifier
  RETURN: returns `Account updated successfully` else returns `User not found` message

- ``/portfolio/v1/users/{user_id}/delete``:
  Delete user's data in the portfolio database.
  METHOD: DELETE
  PARAMETER: user_id (uuid): the user's unique identifier
  RETURN: returns nothing on success else returns `User not found` message when user does not exists

- ``/portfolio/v1/users/create``:
  Create new user in the portfolio database.
  METHOD: POST
  RETURN: returns `Account created successfully`

### Authenticate

- ``/portfolio/v1/login_token``:
  Bearer token login to portfolio system using `Bearer token`
  METHOD: POST
  RETURN: Bearer token

- ``/portfolio/v1/login``:
  Basic login to portfolio system using username and password
  METHOD: POST
  RETURN: Returns `access token`, `token type` and `username`

- ``/portfolio/v1/logout``:
  Logout the user.
  METHOD: GET
  RETURN: Redirect to home page on success

### Tokens

- ``/portfolio/v1/tokens``:
  List all the user's tokens in the database.
  METHOD: GET
  RETURN: Returns list of all the tokens of the user with the tokens data.

- ``/portfolio/v1/tokens/{token_id}``:
  Retrieve a token's data.
  METHOD: GET
  PARAMETER: token_id (int): token's unique identifier
  RETURN: Returns token's data else returns

- ``/portfolio/v1/tokens/{token_id}/update``:
  Updates token's data in the database.
  METHOD: PUT
  PARAMETER: token_id (int): token's unique identifier
  RETURN: Returns `Token updated successfully`

- ``/portfolio/v1/tokens/{token_id}/delete``:
  Delete token in the database.
  METHOD: DELETE
  PARAMETER: token_id (int): token's unique identifier
  RETURN: Returns thing on success

- ``/portfolio/v1/tokens/create``:
  Add new token in the database.
  METHOD: POST
  RETURN: Returns the new token data on success
