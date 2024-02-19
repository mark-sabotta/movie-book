"use strict";

/** Routes for movies. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const Movie = require("../models/movie");
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
    try {
        const validator = jsonschema.validate(req.body, movieListSchema);

        /**  Since this resquest is made for the sake of the db while the client is searching,
        *    I should consider if this is the error handling I want
        */

        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const movieList = Array.from(req.body.Search);
        for (let movie of movieList) {
            Movie.add(movie.imdbID, movie.Title, movie.Poster);
        }

        return res.status(201).json({ movieList });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;