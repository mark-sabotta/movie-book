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


    /** Triggered by search form submit; reloads movies. */
    async function search(title) {
        let movieList = await MovieBookApi.getMovies(title);
        if(movieList.Response === "False") return;
        MovieBookApi.addMoviesToDB({movieList: movieList.movieList});
        setMovies(movieList.movieList.Search);
    }

    if (!movies) return <LoadingSpinner />;



    return (
        <div className="MovieList col-md-8 offset-md-2">
            <SearchForm searchFor={search} />
            {movies.length
                ? (
                    <div className="MovieList-list">
                        {movies.map(m => (
                            <MovieCard
                                key={m.imdbID}
                                imdbid={m.imdbID}
                                title={m.Title}
                                image={m.Poster}
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