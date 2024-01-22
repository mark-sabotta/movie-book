import React, { useState, useEffect } from "react";
import SearchForm from "../common/SearchForm";
import MovieBookApi from "../api/api";
import MovieCard from "./MovieCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Show page with list of movies.
 *
 * On mount, loads movies from API.
 * Re-loads filtered movies on submit from search form.
 *
 * This is routed to at /movies
 *
 * Routes -> { MovieCard, SearchForm }
 */

function MovieList() {
    console.debug("MovieList");

    const [movies, setMovies] = useState([]);

    // useEffect(function getMoviesOnMount() {
    //     console.debug("MovieList useEffect getMoviesOnMount");
    //     search();
    // }, []);

    /** Triggered by search form submit; reloads movies. */
    async function search(title) {
        let movies = await MovieBookApi.getMovies(title);
        setMovies(movies);
    }

    if (!movies) return <LoadingSpinner />;

    return (
        <div className="MovieList col-md-8 offset-md-2">
            <SearchForm searchFor={search} />
            {movies.length
                ? (
                    <div className="MovieList-list">
                        {movies.map(c => (
                            <MovieCard
                                key={c.imdbID}
                                imdbid={c.imdbID}
                                title={c.Title}
                                image={c.Poster}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
}

export default MovieList;