"use strict";

/** Routes for movies. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const Movie = require("../models/movie");
const WebAPI = require("../models/web");
const movieListSchema = require("../schemas/movieList.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();

/** POST /movies
 * 
 * Adds a list of movies to the database. Requires a logged-in user.
 *
 * Returns the list.
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {

    if (req.body) {
        try {
            const validator = jsonschema.validate(req.body.movieList, movieListSchema);

            /**  Since this resquest is made for the sake of the db while the client is searching,
            *    I should consider if this is the error handling I want
            */

            if (!validator.valid) {
                const errs = validator.errors.map(e => e.stack);
                throw new BadRequestError(errs);
            }
            const movieList = Array.from(req.body.movieList.Search);
            for (let movie of movieList) {
                Movie.add(movie.imdbID, movie.Title, movie.Poster);
            }

            return res.status(201).json({ movieList });
        } catch (err) {
            return next(err);
        }
    }

});

/** GET movies/imdbid
 * 
 * Searches the database for the specified movie by imdbid
 * 
 * Returns { poster, title }.
 */

router.get("/:imdbid", async function (req, res, next) {
    try {
        const movie = await Movie.get(req.params.imdbid);
        return res.json({ movie }); // Send the movie back as a JSON response
    } catch (err) {
        next(err); // Handle errors appropriately
    }
});

router.get("/xrap/search", ensureLoggedIn, async function (req, res, next) {
    try {
        const movieList = await WebAPI.getMovies(req.query.str);
        return res.json({ movieList });
    } catch (err) {
        next(err);
    }
});

router.get("/tmdb/one", ensureLoggedIn, async function (req, res, next) {
    try {
        const imdbid = req.query.imdbid;
        const movie = await WebAPI.getMovieGenre(imdbid);
        return res.json({ movie });
    } catch (err) {
        next(err);
    }
});

router.get("/tmdb/discover", ensureLoggedIn, async function (req, res, next) {
    try {
        const movieList = await WebAPI.getRecommendedMovies(req.query.genre_id);
        return res.json({ movieList: movieList.results });
    } catch (err) {
        next(err);
    }
});

router.get("/tmdb/imdbid", async function (req, res, next) {
    try {
        const movie = await WebAPI.getIMDBID(req.query.tmdb_id);
        return res.json({ movie });
    } catch (err) {
        next(err);
    }
});

module.exports = router;