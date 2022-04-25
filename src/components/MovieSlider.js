import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Slider from 'react-slick';
import StarRating from 'react-svg-star-rating';

const MovieSlider = (props) => {
    const [movieList, setMovieList] = useState([]);
    const navigate = useNavigate();
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [settings, setSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
    });

    useEffect(async () => {
        const response = await fetch('/api/movie/get'); // filter here
        const movie_list = await response.json();
        for (let i = 0; i < movie_list.length; ++i) {
            const movie_response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${movie_list[i].title}`);
            const movie = await movie_response.json();
            movie_list[i].image = `http://image.tmdb.org/t/p/w500/${movie.results[0] ? movie.results[0].poster_path : `/default_movie_poster.jpg`}`;
        }
        setMovieList(movie_list);
    }, [])

    return(
        <div className="movie-slider">
            <h2> {props.type} </h2>
            <Slider {...settings}>
                {movieList.map((movie, index) => (
                    <div className="movie-item"
                        key={index}
                        >
                        <div className="movie-info"
                            onClick={(e) => navigate(`/movie/${movie._id}`)}
                            style={{
                                transform: hoverIndex === index ? 'translateY(-10px)' : 'none',
                            }}
                            onMouseEnter={(e) => setHoverIndex(index)}
                            onMouseLeave={(e) => setHoverIndex(-1)}>
                            <div className="movie-image">
                                <img src={movie.image}/>
                            </div>

                            <div className="rating">
                                <p>{movie.release}</p>
                                <StarRating
                                    isReadOnly
                                    initialRating={movie.rating}
                                    size={window.innerHeight * 0.03}
                                    />
                            </div>
                            <span>{movie.title.toUpperCase()}</span>
                            <div className="description">
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    </div>
                    ))}
            </Slider>
        </div>
    )
}

export default MovieSlider