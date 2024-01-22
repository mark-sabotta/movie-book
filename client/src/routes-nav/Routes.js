import React from "react";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({ login, signup }) {
    console.debug(
        "Routes",
        `login=${typeof login}`,
        `register=${typeof register}`,
    );

    return (
        <div className="pt-5">
            {/* Conditional rendering for routes */}
            {window.location.pathname === "/" && <Homepage />}
            {window.location.pathname === "/login" && <LoginForm login={login} />}
            {window.location.pathname === "/signup" && <SignupForm signup={signup} />}
            {/* Redirect to homepage for any other path */}
            {window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Homepage />}
        </div>
    );
}

export default Routes;