import React, { useState, useEffect, useContext } from "react";
import UserContext from "../auth/UserContext";
import { useParams, useHistory } from "react-router-dom";
import MovieBookApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

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
    const { history } = useHistory();
    const { currentUser } = useContext(UserContext);
    console.debug("MovieDetail", "imdbid=", imdbid);

    const [movie, setMovie] = useState(null);

    useEffect(function getMovieGenres() {
        async function getMovie() {
            setMovie(await MovieBookApi.getMovieGenre(imdbid));
        }

        getMovie();
    }, [imdbid]);

    if (!movie) return <LoadingSpinner />;
    
    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await rate({username: currentUser.username, imdbid: movie.imdbid, score: 5});
        if (result.success) {
            history.push("/");
        } else {
            console.log(result.errors);
        }
    }

    return (
        <div className="col-md-8 offset-md-2">
            <h2 className="text-center font-weight-bold">{movie.title}</h2>
            {movie.poster_path && <img src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                        alt={movie.title}
                        className="float-left mr-5" />}
            <p>{movie.overview}</p>
            <h3>Click a star to rate:</h3>
            <form onSubmit={handleSubmit}><button><img src='http://imgur.com/I0EwG.png' /></button></form>
        </div>
    )
}

export default MovieDetail;