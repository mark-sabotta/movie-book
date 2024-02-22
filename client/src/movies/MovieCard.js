import React from "react";

import "./MovieCard.css";

/** Show limited information about a movie
 *
 * Is rendered by MovieList to show a "card" for each movie.
 *
 * MovieList -> MovieCard
 */

function MovieCard({ title, image, imdbid }) {
    console.debug("MovieCard", image);

    return (
        <a className="MovieCard card" href={`/movies/${imdbid}`}>
            <div className="card-body">
                <h6 className="card-title">
                    {title}
                    {image && <img src={image}
                        alt={title}
                        className="float-right ml-5" />}
                </h6>
            </div>
        </a>
    );
}

export default MovieCard;