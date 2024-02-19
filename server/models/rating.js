"use strict";

const pool = require("../db");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for ratings */

class Rating {
    static async rate(
        { username, imdbid, score }) {
        const duplicateCheck = await pool.query(
            `SELECT username
               FROM ratings
               WHERE username = ?
               AND imdbid = ?`,
            [username, imdbid]
        );


        if (duplicateCheck[0][0]) {
            throw new BadRequestError(`Duplicate rating: ${username, imdbid}`);
        }

        await pool.query(
            `INSERT INTO ratings
           (username,
            imdbid,
            rating)
           VALUES (?, ?, ?)`,
            [
                username,
                imdbid,
                score,
            ],
        );

        const ratingRes = await pool.query(
            `SELECT imdbid FROM ratings WHERE username = ? AND imdbid = ?`,
            [username, imdbid]
        );

        return ratingRes[0][0];
    }


    /** Delete given user's movie rating from database; returns undefined. */
    static async remove(imdbid, username) {
        await pool.query(
            `DELETE FROM ratings
            WHERE username = ?
            AND imdbid = ?`,
            [username, imdbid]
        );

    }
}

module.exports = Rating;