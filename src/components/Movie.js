import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../style/Movie.css'
import TopBar from "./TopBar";
import StarRating from "react-svg-star-rating";
import Comments from "./Comments";

const Movie = () => {
    const { id } = useParams();
    const [ movie, setMovie ] = useState(null);
    const [ rating, setRating ] = useState(0);
    const [ currentUser, setCurrentUser] = useState();

    const fetchMovie = async () => {
        const movie_response = await fetch(`/api/movie/get/${id}`);
        if (movie_response.status <= 200) {
            const fetch_movie = await movie_response.json();
            setRating(fetch_movie.ratings);
            console.log(fetch_movie);
            const movie_img_response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${fetch_movie.title}`);
            const movie_img = await movie_img_response.json();
            setMovie({
                ...fetch_movie,
                image: `http://image.tmdb.org/t/p/w500/${movie_img.results[0].poster_path}`
            });
        }
    }

    const fetchUser = async () => {
        const user_response = await fetch('/api/user/get-current-user');
        if (user_response.status <= 200) {
            const user = await user_response.json();
            setCurrentUser(user);
        }
    }
    useEffect(async () => {
        fetchMovie();
        fetchUser();
    }, []);

    useEffect(async () => {
        if (currentUser) {
            const review_response = await fetch(`/api/review/${currentUser._id}/${id}`);
            if (review_response.status <= 200) {
                const result = await review_response.json();
                setRating(result.ratings);
            }
        }
    }, [currentUser]);

    const updateMovieRating = (star) => {
        setRating(star);
        if (currentUser && movie) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userid: currentUser._id,
                    movieid: movie._id,
                    ratings: star
                })
            };
            fetch('/api/review/create', requestOptions)
                .then(res => res.json())
                .then(res => {
                    if (res.message) {
                    } 
                    else {
                        fetchMovie();
                    }
                });
        }
    }

    return movie ? (
        <div className="movie">
            <TopBar currentUser={currentUser}/>
            <div className="heading">
                <img src={movie.image}/>
                <div className="info">
                    <h1>{movie.title.toUpperCase()}</h1>
                    <h3>{(new Date(Date.parse(movie.release))).getFullYear()}</h3>
                    <h3>Director: {movie.director}</h3>
                    <h3>Starring: {movie.stars.join(" , ")}</h3>
                    {console.log(movie.stars)}
                    <div className="avg-rating">
                        <h3>Community Rating</h3>
                        <StarRating
                            isReadOnly
                            unit="float"
                            initialRating={movie.rating}
                        />
                    </div>

                    <div className="user-rating">
                        <h3>Your Rating</h3>
                        <StarRating
                            unit="float"
                            handleOnClick={updateMovieRating}
                            initialRating={rating}
                        />
                    </div>
                </div>

            </div>
            <p className="description">{movie.overview}</p>
            <Comments currentUser={currentUser}
                    movie={movie}/>
        </div>
    ) : (
        <div></div>
    )
}

export default Movie;