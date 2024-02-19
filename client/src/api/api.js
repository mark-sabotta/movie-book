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
            const result = await axios({ url, method, data, params, headers });
            console.log(result);
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

    /** Sends user's rating of a movie to be added to the database */

    static async rateMovie(data){
        let res = await this.request(`ratings`, data, "post");
        return res.user;
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

}




export default MovieBookApi;