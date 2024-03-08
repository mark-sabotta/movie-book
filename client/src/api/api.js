import axios from "axios";
import env from "../env";


const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MovieBookApi {
    // the token for interaction with the API will be stored here.
    static token;


    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${MovieBookApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            console.log("url:", url, "method:", method, "params:", params, "data:", data, "headers:", headers);
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
        return res.Search;
    }

    /** Sends username and returns all user's rated movies from database */

    static async getUserRatings(username, data) {
        console.log("api:66", username);
        console.log("api:67", data);
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
        console.log("api:82", imdbid);
        console.log("api:83", data);
        let res = await this.request(`movies/${imdbid}`, { "imdbid": imdbid }, "get");
        return res.movie;
    }

    /** Searches X-Rapid MovieDatabaseAlternative API  */
    static async getMovies(str) {
        const options = {
            method: 'GET',
            url: 'https://movie-database-alternative.p.rapidapi.com/',
            params: {
                s: str,
                r: 'json',
                type: 'movie',
                page: '1'
            },
            headers: {
                'X-RapidAPI-Key': env.X_RAPID_KEY,
                'X-RapidAPI-Host': env.X_RAPID_HOST
            }
        };

        try {
            const response = await axios.request(options);
            return (response.data);
        } catch (error) {
            console.error(error);
        }
    }


    /** Searches TheMovieDatabase API */
    static async getMovieGenre(imdbid) {
        const url = `${env.MOVIE_DB_BASE_URL}${imdbid}?${env.MOVIE_DB_SOURCE}`;
        const options = {
            method: 'GET',
            url: url,
            headers: {
                accept: 'application/json',
                Authorization: env.THE_MOVIE_DB_AUTH
            }
        };

        try {
            const response = await axios.request(options);
            return (response.data.movie_results[0]);
        } catch (error) {
            console.error(error);
        }
    }


    static async getRecommendedMovies(genre_id) {
        const url = env.THE_MOVIE_DB_DISCOVER_URL + genre_id;
        const options = {
            method: 'GET',
            url: url,
            headers: {
                accept: 'application/json',
                Authorization: env.THE_MOVIE_DB_AUTH
            }
        };

        try {
            const response = await axios.request(options);
            return (response.data.results);
        } catch (error) {
            console.error(error);
        }
    }

    static async getIMDBID(tmdb_id) {
        const url = env.THE_MOVIE_DB_ID_SWAP + tmdb_id + "?language=en-US";
        const options = {
            method: 'GET',
            url: url,
            headers: {
                accept: 'application/json',
                Authorization: env.THE_MOVIE_DB_AUTH
            }
        };

        try {
            const response = await axios.request(options);
            return (response.data);
        } catch (error) {
            console.error(error);
        }
    }

};


export default MovieBookApi;