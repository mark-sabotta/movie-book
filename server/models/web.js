const WebConstants = require("../helpers/webConstants");
const dotenv = require("dotenv");
dotenv.config();


class WebAPI {
    static async getMovies(str) {
        const url = 'https://movie-database-alternative.p.rapidapi.com/';
        const params = {
            s: str,
            r: 'json',
            type: 'movie',
            page: '1'
        };
        const queryString = new URLSearchParams(params);
        const fullUrl = `${url}?${queryString}`;

        const headers = new Headers({
            'X-RapidAPI-Key': process.env.X_RAPID_KEY,
            'X-RapidAPI-Host': WebConstants.X_RAPID_HOST
        });

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    static async getMovieGenre(imdbid) {
        const url = `${WebConstants.MOVIE_DB_BASE_URL}${imdbid}?${WebConstants.MOVIE_DB_SOURCE}`;
        const headers = new Headers({
            accept: 'application/json',
            Authorization: `Bearer ${process.env.THE_MOVIE_DB_KEY}`
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.movie_results[0];
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    static async getRecommendedMovies(genre_id) {
        const url = WebConstants.THE_MOVIE_DB_DISCOVER_URL + genre_id;
        const headers = new Headers({
            accept: 'application/json',
            Authorization: `Bearer ${process.env.THE_MOVIE_DB_KEY}`
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    static async getIMDBID(tmdb_id) {
        const url = WebConstants.THE_MOVIE_DB_ID_SWAP + tmdb_id + "?language=en-US";
        const headers = new Headers({
            accept: 'application/json',
            Authorization: `Bearer ${process.env.THE_MOVIE_DB_KEY}`
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Error:", error);
        }
    }
}

module.exports = WebAPI;