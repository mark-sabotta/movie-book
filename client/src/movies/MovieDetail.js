import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import MovieBookApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import RatingForm from "../common/RatingForm";

/** Company Detail page.
 *
 * Renders information about a movie, along with the option for the user to rate it.
 *
 * Routed at /movies/:id
 *
 * Routes -> MovieDetail -> MovieList
 */

function MovieDetail({ rate }) {
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
            <h2 className="text-center font-weight-bold">{movie.title}</h2>
            {movie.poster_path && <img src={"https://image.tmdb.org/t/p/w154" + movie.poster_path}
                        alt={movie.title}
                        className="float-left mr-5" />}
            <p>{movie.overview}</p>
            <h3>Click a star, then click rate:</h3>
            <RatingForm rate={rate} imdbid={imdbid} />
        </div>
    )
}

export default withRouter(MovieDetail);