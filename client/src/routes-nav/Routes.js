import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import MovieList from "../movies/MovieList";
import PrivateRoute from "./PrivateRoute";
import MovieDetail from "../movies/MovieDetail";


/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({ login, signup, rate }) {
    console.debug(
        "Routes",
        `login=${typeof login}`,
        `signup=${typeof signup}`,
        `rate=${typeof rate}`,
    );

    return (
        <div className="pt-5">
            <Switch>
                {/* Conditional rendering for routes */}
                <Route exact path="/">
                    <Homepage />
                </Route>

                <Route exact path="/login">
                    <LoginForm login={login} />
                </Route>

                <Route exact path="/signup">
                    <SignupForm signup={signup} />
                </Route>

                <PrivateRoute exact path="/movies">
                    <MovieList />
                </PrivateRoute>

                <PrivateRoute exact path="/movies/:imdbid">
                    <MovieDetail rate={rate}/>
                </PrivateRoute>
                {/* Redirect to homepage for any other path */}
                <Redirect to="/" />
            </Switch>
        </div>
    );
}

export default withRouter(Routes);