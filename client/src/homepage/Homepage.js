import React, { useContext } from "react";
import { Link } from "react-router-dom";
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

function Homepage() {
    const { currentUser } = useContext(UserContext);
    console.debug("Homepage", "currentUser=", currentUser);

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 font-weight-bold">MovieBook</h1>
                <p className="lead">All your favorite movies, and what to watch next.</p>
                <hr></hr>
                {currentUser
                    ?
                    <div>
                        <h2>
                            Welcome Back, {currentUser.firstName || currentUser.username}!
                        </h2>
                        <form><input type={"text"}></input><button>Search</button></form>
                        <p>A movie</p>
                        <h2>We recommended:</h2>
                        <p>this movie</p>
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