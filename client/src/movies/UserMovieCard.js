import React from "react";
//import { Link } from "react-router-dom";

import "./UserMovieCard.css";

/** Show limited information about a movie the user has rated
 *
 * Is rendered by the Homepage to show a "card" for each rated movie.
 *
 * Homepage -> UserMovieCard
 */

function UserMovieCard({ title, image, imdbid, rating }) {
    console.debug("UserMovieCard", image);

    return (
        <a className="MovieCard card" href={`/movies/${imdbid}`}>
            <div className="card-body">
                <h6 className="card-title">
                    {title}
                    {image && <img src={image}
                        alt={title}
                        className="float-right ml-5" />}
                </h6>
                <p><small>⭐⭐⭐★★</small></p>
            </div>
        </a>
    );
}

export default UserMovieCard;