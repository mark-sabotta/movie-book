import React, { useState } from "react";
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
    const [movies, setMovies] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state

    /** Triggered by search form submit; reloads movies. */
    async function search(title) {
        setLoading(true); // Set loading state to true
        setSearched(true); // Set searched flag to true
        let movieList = await MovieBookApi.getMovies(title);
        if (movieList.Response === "False") return;
        MovieBookApi.addMoviesToDB({ movieList: movieList.movieList });
        setMovies(movieList.movieList.Search);
        setLoading(false); // Set loading state to false after results are received
    }

    return (
        <div className="MovieList col-md-8 offset-md-2">
            <SearchForm searchFor={search} />
            {loading && ( // Render loading spinner while loading
                <LoadingSpinner />
            )}
            {searched && !movies.length && !loading && ( // Show "no results" message after search completes with no results
                <p className="lead">Sorry, no results were found!</p>
            )}
            {movies.length > 0 && ( // Render movies if search returned results
                <div className="MovieList-list">
                    {movies.map((m) => (
                        <MovieCard
                            key={m.imdbID}
                            imdbid={m.imdbID}
                            title={m.Title}
                            image={m.Poster}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MovieList;