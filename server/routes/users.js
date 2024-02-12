"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

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


/** POST /[username]/ratings/[id]  { movie } => { rating }
 *
 * Returns {"rated": imdbId}
 *
 * Authorization required: same-user-as-:username
 * */

router.post("/:username/ratings/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const movieId = +req.params.id;
        await User.rateMovie(req.params.username, movieId);
        return res.json({ rated: movieId });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;