import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserMovieCard from "../movies/UserMovieCard";
import "./Homepage.css";
import UserContext from "../auth/UserContext";
import MovieCard from "../movies/MovieCard";

/** Homepage of site.
 *
 * Shows welcome message, movie search bar, movies rated, and movies recommended or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
    const { currentUser } = useContext(UserContext);
    const userMovies = {};
    console.debug("Homepage", "currentUser=", currentUser);

    return (
        <div className="Homepage">
            <div className="container text-center">
        
                {currentUser
                    ?
                    <div>
                        <h4>
                            Welcome Back, {currentUser.username}!
                        </h4>
                        <hr></hr>
                        <h3>Rate movies to get recommended more:</h3> <a href="/movies">Search for movies</a>
                        <br />
                        <h3>Your ratings:</h3>
                        <div className="MovieList col-md-8 offset-md-2">
                            {userMovies.length
                                ? (
                                    <div className="MovieList-list">
                                        {userMovies.map(c => (
                                            <UserMovieCard
                                                key={c.imdbID}
                                                imdbid={c.imdbID}
                                                title={c.Title}
                                                image={c.Poster}
                                                rating={c.rating}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="lead">No movies rated yet</p>
                                )}
                        </div>
                        

                        <h2>We recommended:</h2>
                        <MovieCard 
                            title = "Shrek"
                            imdbid={"tt0126029"}
                            image="https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
                        />
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