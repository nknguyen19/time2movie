import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import Slider from 'react-slick';
import MovieSlider from "./MovieSlider";
import MessageBox from "./MessageBox";
import Footer from "./Footer";
import BASE_URL from "../BaseUrl";

const Home = () => {
    const naviagate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const [settings, setSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        autoplay: true,
        autoplaySpeed: 6000,
      });
    const [movieList, setMovieList] = useState([]);

    const fetchUser = async () => {
        setCurrentUser(JSON.parse(window.localStorage.getItem('currentUser')));
    }

    useEffect(async () => {
        const movie_list_response = await fetch(`${BASE_URL}/api/movie/get`);
        let movie_list = await movie_list_response.json();
        for (let i = 0; i < movie_list.length; ++i) {
            const movie_response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${movie_list[i].title}`);
            const movie = await movie_response.json();
            movie_list[i].image = `http://image.tmdb.org/t/p/w500/${movie.results[0] ? movie.results[0].poster_path : `/default_movie_poster.jpg`}`;
        }
        setMovieList(movie_list);

        fetchUser();
    }, [])
    
    return (
        <div className="home">
            <TopBar currentUser={currentUser}/>
            <div className="intro-slider">
                <Slider {...settings}>
                    {movieList.map(movie => (
                        <div className="movie-intro">
                            <div className="movie-title">
                                <h1>{movie.title} ({movie.release})</h1>
                                <h2>By <h2>{movie.director}</h2></h2>
                                <p>{movie.overview}</p>
                            </div>
                            
                            <div className="movie-image">
                                <img src={movie.image}/>
                            </div>
                            
                        </div>
                    ))}
                </Slider>
            </div>

            <MovieSlider type="Trending now" />

            <MovieSlider type="Newest" />

            {currentUser ? <MovieSlider type="Recommended for you" userId={currentUser._id}/> : ''}

            {currentUser ? <MessageBox /> : ''}

            <Footer />
        </div>
    )
}

export default Home;