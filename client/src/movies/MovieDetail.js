import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieBookApi from "../api/api";
import MovieList from "./MovieList";
import LoadingSpinner from "../common/LoadingSpinner";

/** Company Detail page.
 *
 * Renders information about a movie, along with the option for the user to rate it.
 *
 * Routed at /movies/:id
 *
 * Routes -> MovieDetail -> MovieList
 */

function MovieDetail() {
    const { imdbid } = useParams();
    console.debug("MovieDetail", "imdbid=", imdbid);

    const [movie, setMovie] = useState(null);

    useEffect(function getMovieGenres() {
        async function getMovie() {
            setMovie(await MovieBookApi.getMovieGenre(imdbid));
        }

        getMovie();
    }, [imdbid]);

    if (!movie) return <LoadingSpinner />;

    return (
        <div className="col-md-8 offset-md-2">
            <h4>{movie.title}</h4>

        </div>
    )
}

export default MovieDetail;