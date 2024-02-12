"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Rating = require("../models/user");
const rating = require("../schemas/rating.json")

const router = express.Router();


/** POST /ratings/[imdbid]/[username]/[score]  => { imdbid }
 *
 * Adds a new user movie rating.
 *
 * This returns the newly created rating.
 *
 **/

router.post("/:imdbid/:username/:score", ensureLoggedIn, async function (req, res, next) {
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


/** DELETE /delete/[imdbid]/[username]  =>  { deleted: imdbid }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete("/delete/:imdbid/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        await Rating.remove(req.params.imdbid, req.params.username);
        return res.json({ deleted: req.params.imdbid });
    } catch (err) {
        return next(err);
    }
});