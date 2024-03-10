class WebConstants {
    static X_RAPID_HOST = 'movie-database-alternative.p.rapidapi.com';
    static MOVIE_DB_SOURCE = 'external_source=imdb_id';
    static MOVIE_DB_BASE_URL = 'https://api.themoviedb.org/3/find/';
    static THE_MOVIE_DB_DISCOVER_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=';
    static THE_MOVIE_DB_ID_SWAP = 'https://api.themoviedb.org/3/movie/';
    static THE_MOVIE_DB_POSTER_BASE = 'https://image.tmdb.org/t/p/original';
}

module.exports = WebConstants;