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

/** Related functions for users. */

class User {
    /** authenticate user with username, password.
     *
     * Returns { username, email }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        // try to find the user first
        const result = await pool.query(
            `SELECT username,
                  password,
                  email
           FROM users
           WHERE username = ?
           `, [username]);

        const user = result[0][0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, email }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, email }) {
        const duplicateCheck = await pool.query(
            `SELECT username
           FROM users
           WHERE username = ?`,
            [username]
        );

        if (duplicateCheck[0][0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        await pool.query(
            `INSERT INTO users
           (username,
            password,
            email)
           VALUES (?, ?, ?)`,
            [
                username,
                hashedPassword,
                email,
            ],
        );

        const userRes = await pool.query(
            `SELECT username, email FROM users WHERE username = ?`,
            [username]
        );

        const user = userRes[0][0];

        return user;
    }

    /** Find all users.
     *
     * Returns [{ username, email }, ...]
     **/


    /** Given a username, return data about user.
     *
     * Returns { username }
     *   
     *
     * Throws NotFoundError if user not found.
     **/

    static async get(username) {
        const userRes = await pool.query(
            `SELECT username,
                  email
           FROM users
           WHERE username = ?`,
            [username],
        );

        const user = userRes[0][0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        const userRatingsRes = await pool.query(
            `SELECT r.imdbid
           FROM ratings AS r
           WHERE r.username = ?`, [username]);

        //user.ratings = userRatingsRes.rows.map(a => a.movie_id);
        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { username, password, email }
     *
     * Returns { username, email }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                username: "username"
            });

        const querySql = `UPDATE users SET ${setCols} WHERE username = ?`;
        const result = await db.query(querySql, [...values, username]);

        // Retrieve updated user data using a separate query
        const userRes = await pool.query(
            `SELECT username, email FROM users WHERE username = ?`,
            [username]
        );
        const user = userRes[0][0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    /** Delete given user from database; returns undefined. */

    static async remove(username) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE username = ?`,
            [username],
        );

    }

    /** Rate a movie: update db, returns undefined.
     *
     * - username: username rating movie
     * - imdbid: IMDB id
     **/

    static async rateMovie(username, imdbid, rating) {
        const confirmMovie = await db.query(
            `SELECT imdbid
           FROM movies
           WHERE imdbid = ?`, [imdbid]);
        const movie = confirmMovie.rows[0];

        if (!movie) throw new NotFoundError(`No movie: ${imdbid}`);

        const confirmUser = await db.query(
            `SELECT username
           FROM users
           WHERE username = ?`, [username]);
        const user = confirmUser.rows[0];

        if (!user) throw new NotFoundError(`No username: ${username}`);

        await db.query(
            `INSERT INTO ratings (username, imdbid, rating)
           VALUES (?, ?, ?)`,
            [username, imdbid, rating]);
    }

    /** Delete given user's movie rating from database; returns undefined. */
    static async removeRating(imdbid, username){
        await pool.query(
            `DELETE FROM ratings
            WHERE username = ?
            AND imdbid = ?`,
            [username, imdbid]
        );

    }
}


module.exports = User;