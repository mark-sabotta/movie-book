**About the frontend:**

This site was created using Create React App. Since its creation I have learned about Vite and I plan to use that to create personal applications in the future, due to the lack of continued support for CRA and complications with webpack.

**The components:**

### App 
State: user, token, movieRatings, recommendedGenres, recommendedMovies

Functions: handleMovieRating, loadUserInfo, recommedGenres, recommendMovies, logout, login, signup, hasRatedMovie, rateMovie

The App component manages all the other components by keeping track of the user context for them. It provides persistent logged-in status, movie ratings, and recommendations, and holds the logic for buttons throughout the site.

### Homepage
Uses the user context 