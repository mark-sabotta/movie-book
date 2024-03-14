import axios from "axios";


const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";


class MovieBookApi {
    // the token for interaction with the API will be stored here.
    static token;


    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${MovieBookApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            const result = await axios({ url, method, data, params, headers });
            return result.data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Get token for login from username, password. */

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    /** Signup for site. */

    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    /** Save user profile page. */

    static async saveProfile(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }

    /** Sends search results of movies to be added to the database */

    static async addMoviesToDB(data) {
        let res = await this.request(`movies`, data, "post");
        return res.movieList;
    }

    /** Sends username and returns all user's rated movies from database */

    static async getUserRatings(username, data) {
        let res = await this.request(`users/${username}/ratings`, data, "get");
        return res;
    }

    /** Sends user's rating of a movie to be added to the database */

    static async rateMovie(data) {
        let res = await this.request(`ratings`, data, "post");
        return res.movie;
    }

    /** Sends imdbid returns movie's poster and title from the database */

    static async getMovie(imdbid, data) {
        let res = await this.request(`movies/${imdbid}`, { "imdbid": imdbid }, "get");
        return res.movie;
    }

    /** Searches X-Rapid MovieDatabaseAlternative API  */
    static async getMovies(str) {
        let res = await this.request(`movies/xrap/search`, {str: str}, "get");
        return res;
    }


    /** Searches TheMovieDatabase API */
    static async getMovieGenre(imdbid) {
        let res = await this.request(`movies/tmdb/one`, {imdbid: imdbid}, "get");
        return res;
    }


    static async getRecommendedMovies(genre_id) {
        let res = await this.request(`movies/tmdb/discover`, {genre_id: genre_id}, "get");
        return res.movieList;
    }

    static async getIMDBID(tmdb_id) {
        let res = await this.request(`movies/tmdb/imdbid`, {tmdb_id: tmdb_id}, "get");
        return res;
    }

};


export default MovieBookApi;