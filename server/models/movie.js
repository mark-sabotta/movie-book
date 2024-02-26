"use strict";

const pool = require("../db");
const mysql = require("mysql2");


/** Related functions for movies. */

class Movie {
    /** adds movie to the database
     * 
     * returns { imdbid }
     * 
     * returns early if duplicate is found
     */

    static async add( imdbid, title, poster ) {
        const duplicateCheck = await pool.query(
            `SELECT imdbid
           FROM movies
           WHERE imdbid = ?`,
            [imdbid]
        );

        if (duplicateCheck[0][0]) {
            return { imdbid: imdbid }
        }

        await pool.query(
            `INSERT INTO movies
           (imdbid,
            title,
            poster)
           VALUES (?, ?, ?)`,
            [
                imdbid,
                title,
                poster,
            ],
        );

        const movieRes = await pool.query(
            `SELECT imdbid FROM movies WHERE imdbid = ?`,
            [imdbid]
        );

        const movie = movieRes[0][0];

        return movie;
    }

    /** Finds the movie in the database with the given imdbid
     * 
     * Returns its poster url and title
     */

    static async get( imdbid ){
        console.log("movie.js get imdbid:", imdbid);
        const movieRes = await pool.query(
            `SELECT poster, title FROM movies WHERE imdbid = ?`,
            [imdbid]
        );

        const movie = movieRes[0][0];

        return movie;
    }
}

module.exports = Movie;