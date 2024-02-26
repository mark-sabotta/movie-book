"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Movie = require("../models/movie");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const ratingSchema = require("../schemas/rating.json")

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, email }, token }
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});


/** GET /[username] => { user }
 *
 * Returns { username, ratings }
 *   where ratings is { movie_id, rating }
 *
 * Authorization required: same user-as-:username
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { username, password, email }
 *
 * Returns { username, email, email }
 *
 * Authorization required: same-user-as-:username
 **/

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username]/ratings => { user }
 *
 * Returns { username, ratings }
 *   where ratings is { movie_id, rating }
 *
 * Authorization required: same user-as-:username
 **/

 router.get("/:username/ratings", ensureLoggedIn, async function (req, res, next) {
    console.log(req.params);
    
    try {
        const movies = await User.getAllRatedMovies(req.params.username);
        return res.json({ movies });
    } catch (err) {
        return next(err);
    }
});


/** POST /[username]/ratings/[imdbid]/[score]  { movie } => { rating }
 *
 * Returns {"rated": imdbId}
 *
 * Authorization required: same-user-as-:username
 * */

router.post("/:username/ratings/:imdbid/:rating", ensureLoggedIn, async function (req, res, next) {
    try {
        const rating = +req.params.rating;
        const validator = jsonschema.validate(req.body, ratingSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        await User.rateMovie(req.params.username, req.params.id, rating);
        return res.json({ rated: imdbid });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[username]/ratings/delete/[imdbid]  =>  { deleted: imdbid }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete("/:username/ratings/delete/:imdbid", ensureLoggedIn, async function (req, res, next) {
    try {
        await User.removeRating(req.params.username, req.params.imdbid);
        return res.json({ deleted: imdbid });
    } catch (err) {
        return next(err);
    }
});

//this shouldn't stay here
router.get("/movie/:imdbid", ensureLoggedIn, async function (res, req, next) {
    const imdbid = req.params.imdbid;

    try {
        const movie = await Movie.get(imdbid);
        res.json(movie); // Send the movie back as a JSON response
    } catch (err) {
        next(err); // Handle errors appropriately
    }
});

module.exports = router;