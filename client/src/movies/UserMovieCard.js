import React from "react";
//import { Link } from "react-router-dom";

import "./UserMovieCard.css";

/** Show limited information about a movie the user has rated
 *
 * Is rendered by the Homepage to show a "card" for each rated movie.
 *
 * Homepage -> UserMovieCard
 */

function UserMovieCard({ title="Title Not Found", image, imdbid, rating = "false" }) {

    // Conditional logic for image display
    const displayImage = image !== "N/A";
    if(title.length > 20) title = title.slice(0,17) + "...";

    if (rating !== "false") {
        const litStars = rating;
        let starRating = "";
        for (let i = 0; i < 5; i++) {
            starRating += i < litStars ? "⭐" : "☆";
        }

        return (
            <a className="UserMovieCard card" href={`/movies/${imdbid}`}>
                <div className="user-card-body">
                    <h6 className="user-card-title">
                        {title}
                    </h6>
                    {displayImage && <img src={image}
                        alt={title} 
                        className="" />}
                    <p><small>{starRating}</small></p>
                </div>
            </a>
        );
    }

    return (
        <a className="UserMovieCard card" href={`/movies/${imdbid}`}>
            <div className="user-card-body">
                <h6 className="user-card-title">
                    {title}
                </h6>
                {displayImage && <img src={image}
                    alt={title}
                    className="" />}
                <p><small>Learn more</small></p>
            </div>
        </a>
    );
}

export default UserMovieCard;