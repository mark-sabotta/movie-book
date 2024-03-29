import React, { useState, useEffect } from "react";
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
const THE_MOVIE_DB_POSTER_BASE = 'https://image.tmdb.org/t/p/original';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [movieRatings, setMovieRatings] = useState({});
  const [recommendedGenres, setRecommendedGenres] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState({});


  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.

  async function handleMovieRating(imdbid, title, poster, rating) {
    setMovieRatings(prevRatings => ({
      ...prevRatings,
      [imdbid]: {
        title,
        poster,
        rating,
      },
    }));
  };



  useEffect(function loadUserInfo() {
    //console.debug("App useEffect loadUserInfo", "token=", token);

    /** Updates the state when the user rates a movie */

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          // put the token on the Api class so it can use it to call the API.
          MovieBookApi.token = token;
          let currentUser = await MovieBookApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          if (currentUser) {
            const currentRatings = await MovieBookApi.getUserRatings(username);
            for (let i = 0; i < currentRatings.movies.length; i++) {
              const movie = currentRatings.movies[i];
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

  useEffect(function recommendGenres() {
    async function getRecommendedGenres() {
      if (!movieRatings) return;

      const genreMap = {};
      for (let imdbid in movieRatings) {
        if (movieRatings[imdbid]?.rating >= 3) {
          const movie = await MovieBookApi.getMovieGenre(imdbid) || {};
          for (let i = 0; i < movie.movie.genre_ids?.length; i++) {
            genreMap[movie.movie.genre_ids[i]] += imdbid.rating;
          }
        }
      }
      const recommendedGenres = Object.keys(genreMap);
      recommendedGenres.sort((a, b) => genreMap[a] > genreMap[b]);
      setRecommendedGenres(recommendedGenres);
    }

    if (Object.keys(movieRatings).length > 0) {
      setInfoLoaded(false);
      getRecommendedGenres();
      setInfoLoaded(true);
    }
  }, [movieRatings]);

  useEffect(function recommendedMovies() {

    async function getRecommendedMovies() {
      if (recommendedGenres.length > 0) {
        let x = 0;
        const recommendedMovies = {};
        let genreIndex = 0;
        while (x < 3 && genreIndex < recommendedGenres.length) {
          let genre_id = recommendedGenres[genreIndex];
          let currList = await MovieBookApi.getRecommendedMovies(genre_id);
          while (currList.length > 0 && x < 3) {
            let movie = currList.shift();
            let movieImdbid = await MovieBookApi.getIMDBID(movie.id);
            if (!(movieImdbid.imdb_id in movieRatings)) {
              await MovieBookApi.addMoviesToDB({
                movieList: {
                  Search: [{
                    Title: movieImdbid.movie.title, imdbID: movieImdbid.movie.imdb_id,
                    Poster: THE_MOVIE_DB_POSTER_BASE + movieImdbid.movie.poster_path
                  }], totalResults: "1"
                }
              });
              recommendedMovies[movieImdbid.movie.imdb_id] = {
                title: movieImdbid.movie.original_title,
                poster: THE_MOVIE_DB_POSTER_BASE + movieImdbid.movie.poster_path
              };
              x++;
            }
          }
          genreIndex++;
        }
        setRecommendedMovies(recommendedMovies);
      }
    }
    if (recommendedGenres.length > 0) {
      setInfoLoaded(false);
      getRecommendedMovies();
      setInfoLoaded(true);
    }
  }, [recommendedGenres, movieRatings]);



  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
    setMovieRatings({});
    setRecommendedGenres([]);
    setRecommendedMovies({});
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
        //Create a function to update a rating instead
        return;
      }

      // Make both API calls concurrently
      const ratingResult = await
        MovieBookApi.rateMovie({
          username: currentUser.username,
          imdbid: imdbid,
          score: score,
        });
      // Handle the movie rating internally
      const currentRatings = await MovieBookApi.getUserRatings(currentUser.username);
      for (let i = 0; i < currentRatings.movies.length; i++) {
        const movie = currentRatings.movies[i];
        handleMovieRating(movie.imdbid, movie.title, movie.poster, movie.rating);
      }

      return ratingResult; // Return the API response
    } catch (error) {
      console.error("Error rating movie:", error);
      throw error;
    }
  }

  if (!infoLoaded) return <LoadingSpinner />




  return (
    <BrowserRouter>
      <CompatRouter>
        <UserContext.Provider
          value={{ currentUser, setCurrentUser }}>
          <div>
            <Navigation logout={logout} />
            <Routes login={login} signup={signup} rate={rateMovie}
              movieRatings={movieRatings} recommendedMovies={recommendedMovies} />
          </div>
        </UserContext.Provider>
      </CompatRouter>
    </BrowserRouter>
  );
}

export default App;
