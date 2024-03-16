**Backend Overview**

This backend application is built with Node.js, Express, and utilizes a MySQL database for data storage. The API adheres to a RESTful approach with categorized routes (`/users`, `/movies`, `/ratings`).

**API Endpoints**

* **User Management**
    * `/users` (POST): Creates a new user account. Requires a JSON request body containing username and password.

    * `/users/:username` 
        * GET: Retrieves information for a specific user identified by their username in the path parameter.
        * PATCH: Updates existing user information (specific fields in request body).
        * DELETE: Deletes a user account.

    * `/users/:username/ratings` (GET): Retrieves all ratings submitted by a specific user.

    * `/users/:username/ratings/delete/:imdbid` (DELETE): Deletes a specific rating for a movie by the user.


* **Movie Management**
    * `/movies/` (POST): Handles adding movies from external web APIs to the database.

    * `/movies/:imdbid` (GET): Searches for the movie with the given IMDBid within the database. Returns the result.

    * External Movie Data Integration

        * `/movies/xrap/search` (GET): Searches the X Rapid Movie Database Alternative for movies matching the provided query string.

        * `/movies/tmdb/one` (GET): Retrieves detailed information about a movie from The Movie Database (TMDB).

        * `/movies/tmdb/discover` (GET): Gets the highest rated movies from a specific genre ID via the TMDB API.

        * `/movies/tmdb/imdbid` (GET): Retrieves the IMDB ID for a movie using its TMDB ID.


* **Rating Management**
    * `/ratings/` (POST): Creates a new rating for a movie by a user. Requires a JSON request body containing user ID (or username), movie ID (IMDB ID), and rating value.

    * `/ratings/:imdbid` (DELETE): Deletes a specific rating from the database.


* **Model Files**
    * User: Manages data interaction with the `users` table in the database.
    * Movie: Manages data interaction with the `movies` table in the database.
    * Rating: Manages data interaction with the `ratings` table in the database.
    * Web: Handles requests to external web APIs used by the application.

* **Additional Considerations**
    * Authentification: This API uses JWT tokens for user authentification.
    * Error Handling: The API returns appropriate HTTP status codes and informative error messages
    * Security: The API employs input validation and prepared statements to prevent common vulnerabilities




    