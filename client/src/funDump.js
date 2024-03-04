import { CompatRouter } from "react-router-dom-v5-compat";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routes from "./routes-nav/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import MovieBookApi from "./api/api";
import UserContext from "./auth/UserContext";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter } from "react-router-dom";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "moviebook-token";

/** MovieBook application.
 *
 * - infoLoaded: has user data been pulled from API?
 *   (this manages spinner for "loading...")
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */

function App() {
    const [infoLoaded, setInfoLoaded] = useState(false);
    const [movieRatings, setMovieRatings] = useState({});
    const [currentUser, setCurrentUser] = useState({ username: 'billy' });
    const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

    console.debug(
        "App",
        "infoLoaded=", infoLoaded,
        "currentUser=", currentUser,
        "token=", token,
    );

    // Load user info from API. Until a user is logged in and they have a token,
    // this should not run. It only needs to re-run when a user logs out, so
    // the value of the token is a dependency for this effect.

    useEffect(function loadUserInfo() {
        console.debug("App useEffect loadUserInfo", "token=", token);

        /** Updates the state when the user rates a movie */

        function handleMovieRating(imdbid, title, poster, rating) {
            setMovieRatings(prevRatings => ({
                ...prevRatings,
                [imdbid]: {
                    title,
                    poster,
                    rating,
                },
            }));
        };


        async function getCurrentUser() {
            if (token) {
                try {
                    let { username } = jwtDecode(token);
                    // put the token on the Api class so it can use it to call the API.
                    MovieBookApi.token = token;
                    let currentUser = await MovieBookApi.getCurrentUser(username);
                    setCurrentUser(currentUser);
                    if (currentUser) {
                        let currentRatings = await MovieBookApi.getUserRatings(username);
                        for (let i = 0; i < currentRatings.movies.length; i++) {
                            let movie = currentRatings.movies[i];
                            handleMovieRating(movie.imdbid, movie.title, movie.poster, movie.rating);
                        }
                    }

                } catch (err) {
                    console.error("App loadUserInfo: problem loading", err);
                    setCurrentUser(null);
                }
            }
            setInfoLoaded(true);
        }

        // set infoLoaded to false while async getCurrentUser runs; once the
        // data is fetched (or even if an error happens!), this will be set back
        // to false to control the spinner.
        setInfoLoaded(false);
        getCurrentUser();
    }, [token]);

    /** Handles site-wide logout. */
    function logout() {
        setCurrentUser(null);
        setToken(null);
        setMovieRatings({});
    }

    /** Handles site-wide signup.
     *
     * Automatically logs them in (set token) upon signup.
     *
     * Make sure you await this function and check its return value!
     */
    async function signup(signupData) {
        try {
            let token = await MovieBookApi.signup(signupData);
            setToken(token);
            return { success: true };
        } catch (errors) {
            console.error("signup failed", errors);
            return { success: false, errors };
        }
    }

    /** Handles site-wide login.
     *
     * Make sure you await this function and check its return value!
     */
    async function login(loginData) {
        try {
            let token = await MovieBookApi.login(loginData);
            setToken(token);
            return { success: true };
        } catch (errors) {
            console.error("login failed", errors);
            return { success: false, errors };
        }
    }

    /** Checks if a movie has been rated by checking if the id is in movieRatings. */
    function hasRatedMovie(id) {
        return id in movieRatings;
    }



    /** Rate movie: make API call and update set of movie rating IDs. */
    async function rateMovie(imdbid, score) {
        try {
            // Early return for already rated movie
            if (hasRatedMovie(imdbid)) {
                return;
            }

            // Make both API calls concurrently
            const ratingResult = await
                MovieBookApi.rateMovie({
                    username: currentUser.username,
                    imdbid: imdbid,
                    score: score,
                });
            console.log("rR", ratingResult);
            // Handle the movie rating internally
            handleMovieRating(imdbid, ratingResult.title,
                ratingResult.poster, score);

            return ratingResult; // Return the API response
        } catch (error) {
            // Handle errors gracefully
            console.error("Error rating movie:", error);
            throw error; // Re-throw to allow higher-level error handling
        }
    }

    if (!infoLoaded) return <LoadingSpinner />;




    return (
        <BrowserRouter>
            <CompatRouter>
                <UserContext.Provider
                    value={{ currentUser, setCurrentUser }}>
                    <div>
                        <Navigation logout={logout} />
                        <Routes login={login} signup={signup} rate={rateMovie} movieRatings={movieRatings} />
                    </div>
                </UserContext.Provider>
            </CompatRouter>
        </BrowserRouter>
    );
}

export default App;