"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Rating = require("../models/user");
const rating = require("../schemas/rating.json")

const router = express.Router();


/** POST /ratings/ {imdbid, username, score}  => { imdbid }
 *
 * Adds a new user movie rating.
 *
 * This returns the newly created rating.
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, rating);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await Rating.rate(req.body);
        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});


/** DELETE /ratings/delete {imdbid, username}  =>  { deleted: imdbid }
 *
 * Authorization required: same-user-as-username
 **/

router.delete("/delete", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, rating);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        
        await Rating.remove(req.body.imdbid, req.body.username);
        return res.json({ deleted: req.body.imdbid });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;