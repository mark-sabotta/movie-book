import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import "./RatingForm.css";

const RatingForm = ({ rate, username, imdbid }) => {
    const [score, setScore] = useState(0);

    const { history } = useHistory();

    const handleStarClick = (newScore) => {
        setScore(newScore);
    };

    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await rate({ username: username, imdbid: imdbid, score: score });
        if (result.success) {
            history.push("/");
        } else {
            console.log(result.errors);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="rating-container">
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                        key={starValue}
                        className={`star ${score >= starValue ? 'active' : ''}`}
                        onClick={() => handleStarClick(starValue)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button type="submit">Rate</button>
        </form>
    );
};

export default RatingForm;