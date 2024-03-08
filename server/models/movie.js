"use strict";

const pool = require("../db");
const mysql = require("mysql2");


/** Related functions for movies. */

class Movie {
    /** adds movie to the database
     * 
     * returns { imdbid }
     * 
     * updates if duplicate is found
     */

    static async add(imdbid, title, poster) {
        const insertQuery = `
          INSERT INTO movies (imdbid, title, poster)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title), poster = VALUES(poster)
        `;

        try {
            await pool.query(insertQuery, [imdbid, title, poster]);
        } catch (error) {
            console.error("Error adding movie:", error);
            throw error; 
        }

        return { imdbid: imdbid }; 
    }

    /** Finds the movie in the database with the given imdbid
     * 
     * Returns its poster url and title
     */

    static async get(imdbid) {
        const movieRes = await pool.query(
            `SELECT poster, title FROM movies WHERE imdbid = ?`,
            [imdbid.imdbid]
        );
        console.log(movieRes);
        const movie = movieRes[0];

        return movie;
    }

    static async addGenre(imdbid, genre_id) {
        const duplicateCheck = await pool.query(
            `SELECT id FROM movie_genres WHERE imdbid = ? AND genre_id= ?`,
            [imdbid, genre_id]
        );

        if (duplicateCheck[0][0]) {
            return { imdbid: imdbid }
        }

        await pool.query(
            `INSERT INTO movie_genres (imdbid, genre) VALUES (?, ?)`,
            [imdbid, genre_id]
        );

        const genreRes = await pool.query(
            `SELECT id FROM movie_genres WHERE imdbid = ? AND genre_id= ?`,
            [imdbid, genre_id]
        );


        return genreRes[0][0];
    }

    static async getGenres(imdbid) {
        const genreList = await pool.query(
            `SELECT genre_id FROM movie_genres WHERE imdbid = ?`,
            [imdbid]
        );

        return genreList[0];
    }
}

module.exports = Movie;