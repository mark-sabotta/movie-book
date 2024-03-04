import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserMovieCard from "../movies/UserMovieCard";
import "./Homepage.css";
import UserContext from "../auth/UserContext";

/** Homepage of site.
 *
 * Shows welcome message, movie search bar, movies rated, and movies recommended or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage({ movieRatings, recommendedMovies }) {
    const { currentUser } = useContext(UserContext);
    console.debug("Homepage", "currentUser=", currentUser);
    console.debug("Movie ratings in HP", movieRatings);
    console.debug("HP recs", recommendedMovies);


    return (
        <div className="Homepage">
            <div className="container text-center">

                {currentUser
                    ?
                    <div>
                        <h4>
                            Welcome Back, {currentUser.username}!
                        </h4>
                        <hr />
                        <div className="Rating-Link">
                            <h3>Rate movies to get recommended more:</h3>
                            <a href="/movies">Search for movies</a>
                        </div>
                        <hr />
                        <br />
                        <h3>Your ratings:</h3>
                        <div className="userMovieList col-md-8 offset-md-2">
                            {Object.entries(movieRatings).map(([imdbid, movieData]) => ( // Use Object.entries
                                <UserMovieCard
                                    key={imdbid} // Use imdbid as key
                                    imdbid={imdbid}
                                    title={movieData.title} // Access title from movieData object
                                    image={movieData.poster}
                                    rating={movieData.rating}
                                />
                            ))}
                            {movieRatings.length === 0 && ( // Check for empty object
                                <p className="lead">No movies rated yet</p>
                            )}
                        </div>


                        <h2>We recommended:</h2>
                        <div className="userMovieList col-md-8 offset-md-2">
                            {recommendedMovies.length > 0 && (
                                Object.entries(recommendedMovies).map(([imdbid, movieData]) => (
                                    <UserMovieCard
                                        key={imdbid} // Use imdbid as key
                                        imdbid={imdbid}
                                        title={movieData.title} // Access title from movieData object
                                        image={movieData.poster}
                                    />
                                ))
                            )}
                                <p className="lead">Rate movies to start getting recommendations!</p>
                        </div>
                    </div>
                    : (
                        <p>
                            <Link className="btn btn-primary font-weight-bold mr-3"
                                to="/login">
                                Log in
                            </Link>
                            <Link className="btn btn-primary font-weight-bold"
                                to="/signup">
                                Sign up
                            </Link>
                        </p>
                    )}
            </div>
        </div>
    );
}

export default Homepage;