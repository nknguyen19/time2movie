import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../style/Movie.css'
import TopBar from "./TopBar";
import StarRating from "react-svg-star-rating";
import Comments from "./Comments";
import {StickyShareButtons, InlineReactionButtons} from 'sharethis-reactjs';
import Footer from "./Footer";
import MovieSlider from "./MovieSlider";
import BASE_URL from "../BaseUrl";

const Movie = () => {
    const { id } = useParams();
    const [ movie, setMovie ] = useState(null);
    const [ rating, setRating ] = useState(0);
    const [ currentUser, setCurrentUser] = useState();
    const [ similarMovies, setSimilarMovies ] = useState([]);

    const fetchMovie = async () => {
        const movie_response = await fetch(`${BASE_URL}/api/movie/get/${id}`);
        if (movie_response.status <= 200) {
            const fetch_movie = await movie_response.json();
            setRating(fetch_movie.ratings);
            console.log(fetch_movie);
            const movie_img_response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${fetch_movie.title}`);
            const movie_img = await movie_img_response.json();
            setMovie({
                ...fetch_movie,
                image: `http://image.tmdb.org/t/p/w500/${movie_img.results[0] ? movie_img.results[0].poster_path : `/default_movie_poster.jpg`}`
            });
        }
    }

    const fetchUser = async () => {
        const user_response = await fetch(`${BASE_URL}/api/user/get-current-user`);
        if (user_response.status <= 200) {
            const user = await user_response.json();
            setCurrentUser(user);
        }
    }

    const fetchSimilarMovies = async () => {
        const response = await fetch(`${BASE_URL}/api/movie/get-similar/${movie.title}`);
        const data = await response.json();
        console.log(data);
    }

    useEffect(async () => {
        fetchMovie();
        fetchUser();
    }, []);

    useEffect(async () => {
        if (currentUser) {
            const review_response = await fetch(`${BASE_URL}/api/review/get/${currentUser._id}/${id}`);
            if (review_response.status <= 200) {
                const result = await review_response.json();
                setRating(result.ratings);
            }
        }
    }, [currentUser]);
    
    useEffect(async () => {
        if (movie) {
            fetchSimilarMovies();
        }
    }, [movie])

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
            fetch(`${BASE_URL}/api/review/create`, requestOptions)
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
            <StickyShareButtons
                config={{
                    alignment: 'left',    // alignment of buttons (left, right)
                    color: 'social',      // set the color of buttons (social, white)
                    enabled: true,        // show/hide buttons (true, false)
                    font_size: 16,        // font size for the buttons
                    hide_desktop: false,  // hide buttons on desktop (true, false)
                    labels: 'counts',     // button labels (cta, counts, null)
                    language: 'en',       // which language to use (see LANGUAGES)
                    min_count: 0,         // hide react counts less than min_count (INTEGER)
                    networks: [           // which networks to include (see SHARING NETWORKS)
                    'linkedin',
                    'facebook',
                    'pinterest',
                    'twitter',
                    'messenger',
                    ],
                    padding: 12,          // padding within buttons (INTEGER)
                    radius: 4,            // the corner radius on each button (INTEGER)
                    show_total: true,     // show/hide the total share count (true, false)
                    show_mobile: true,    // show/hide the buttons on mobile (true, false)
                    show_toggle: true,    // show/hide the toggle buttons (true, false)
                    size: 48,             // the size of each button (INTEGER)
                    top: 160,             // offset in pixels from the top of the page
        
                    // OPTIONAL PARAMETERS
                    url: window.location.href, // (defaults to current url)
                    image: movie.image, // (defaults to og:image or twitter:image)
                    description: 'Check',       // (defaults to og:description or twitter:description)
                    title: 'custom title',            // (defaults to og:title or twitter:title)
                }}
                />
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

                    <InlineReactionButtons
                    config={{
                        alignment: 'left',  // alignment of buttons (left, center, right)
                        enabled: true,        // show/hide buttons (true, false)
                        language: 'en',       // which language to use (see LANGUAGES)
                        min_count: 0,         // hide react counts less than min_count (INTEGER)
                        padding: 12,          // padding within buttons (INTEGER)
                        reactions: [          // which reactions to include (see REACTIONS)
                        'slight_smile',
                        'heart_eyes',
                        'laughing',
                        'astonished',
                        'sob',
                        'rage'
                        ],
                        size: 25,             // the size of each button (INTEGER)
                        spacing: 5,           // the spacing between buttons (INTE
                    }}
                    />
                </div>
                
            </div>
            <p className="description">{movie.overview}</p>

            {movie ? <MovieSlider type="Similar to this movie" title={movie.title}/> : ''}

            <Comments currentUser={currentUser}
                    movie={movie}/>

            <Footer />
        </div>
    ) : (
        <div></div>
    )
}

export default Movie;