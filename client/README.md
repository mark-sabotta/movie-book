**Frontend Technologies**
This application is built using React and leverages the Create React App (CRA) for its initial setup. While CRA served well for this project, I'm exploring newer tools like Vite for future personal projects due to its potential benefits in development speed and build optimization.

**Component Breakdown**
The frontend is organized into reusable components, each with a specific purpose:

**App Component:**

* Acts as the central hub, managing application state and user context.
* Stores user data (login status, ratings, recommendations)
* Provides functions for user interactions (login, signup, logout, rating movies)
**Homepage:**

* Dynamically renders content based on user login status.
* Displays either a welcome message with login/signup options for unauthenticated users or personalized recommendations and rated movies for logged-in users.
* Utilizes UserMovieCard for both recommendations and rated movies.

**Login & Signup Forms:**

* Allow users to log in or create new accounts.
* Both forms include username and password fields.
* Signup form additionally gathers email information.

**UserMovieCard:**

* A reusable component displaying movie details.
Takes title, poster URL, and optional rating as props.
* Renders a card with movie title, poster image (if available), and a rating display (stars or prompt to rate).
* Clicking the card navigates to the detailed movie information page.

**Movie Detail:**

* Dedicated page showcasing a specific movie.
* Displays full movie description, large poster image, and a RatingForm component for users to rate the movie.

**Rating Form:**

* Enables users to submit a rating for a movie.
* Presents star icons and a submit button for user interaction.
* Submitting a rating updates the database and redirects back to the homepage.

**Movie List:**

* Provides a search interface for finding movies by title.
* Utilizes a SearchForm component for user input.
* Displays search results as MovieCard components, linking to individual movie details.
* Shows a loading indicator while searching and an informative message when no results are found.

**Search Form:**

* Takes user input for searching movies by title or keyword.
* Triggers search on submit and notifies the MovieList component.

**Other Tools:**

* **api.js:** Handles backend communication through a central class for API requests.
* **User Context:** Provides user information throughout components using React's context API.
* **useLocalStorage:** Custom hook for managing token storage in local storage.