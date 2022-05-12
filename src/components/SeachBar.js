import React, { useEffect, useState } from  'react'
import { useNavigate } from 'react-router-dom';
import StarRating from 'react-svg-star-rating';
import BASE_URL from '../BaseUrl';
import '../style/SearchBar.css';

const SearchBar = () => {
    const [movies, setMovies] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [searchImages, setSearchImages] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const navigate = useNavigate();
    console.log(BASE_URL)
    const search = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.value;
        setTimeout(() => {
            if (searchTerm === e.target.value) {
                if (searchTerm.length > 0) {
                    let search_result = [];
                    for (let i = 0; i < movies.length; i++) {
                        if (movies[i].title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            movies[i].director.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            movies[i].gerne.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            movies[i].stars.join(" , ").includes(searchTerm.toLowerCase())) {
                            search_result.push(movies[i]);
                        }
                    }
                    search_result.sort((a,b) => {
                        return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);
                    });
                    setSearchResult(search_result.slice(0, 10));
                }
                else {
                    setSearchResult([]);
                }
            }
            else return;
        } , 500);
    }

    const parseSearchTerm = (searchTerm, str) => {
        let startIndex = 0, index = 0;
        let result = [];
        searchTerm = searchTerm.toLowerCase();
        const lowerCaseStr = str.toLowerCase();
        while ((index = lowerCaseStr.indexOf(searchTerm, startIndex)) > -1) {
            result.push(<p>{str.substring(0, index)}</p>);
            result.push(<p className="match">{str.substring(index, index + searchTerm.length)}</p>)
            startIndex = index + searchTerm.length;
        }
        result.push(<p>{str.substring(startIndex)}</p>);
        return result;
    }

    useEffect(async () => {
        const response = await fetch(`${BASE_URL}/api/movie/getall`);
        const data = await response.json();
        setMovies(data);
    }, [])

    useEffect(async () => {
        let images = [];
        console.log(searchResult);
        for (let i = 0; i < searchResult.length; ++i) {
            const movie_response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${searchResult[i].title}`);
            const movie = await movie_response.json();
            images[i] = `http://image.tmdb.org/t/p/w500/${movie.results[0] ? movie.results[0].poster_path : `/default_movie_poster.jpg`}`;
        }
        setSearchImages(images);
    }, [searchResult]);

    return (
        <div className="search-bar">
            <div className='input-search'>
                <i class="fa fa-search"></i>
                <input id="search-input" type="text" placeholder="Search for a movie..."
                    onFocus={() => setSearchActive(true)}
                    onBlur={(e) => {
                        setTimeout(() => {
                            setSearchActive(false);
                        }, 500);
                    }}
                    onChange={search}
                />
            </div>
            <div className='search-result' 
                style={{
                    display: searchResult.length > 0 && searchActive ? 'block' : 'none'
                }}>
                {searchResult.length > 0 && searchActive ? 
                    searchResult.map((movie, index) => (
                        <div className='search-result-item' key={movie._id}
                            onClick={(e) => {
                                window.open('/movie/' + movie._id, '_blank');
                            }}>
                            <div className='item-image'>
                                <img src={searchImages[index]}/>
                            </div>
                            
                            <div className='item-info'>
                                <p>{parseSearchTerm(document.getElementById("search-input").value, movie.title)}</p>
                                <StarRating 
                                    isReadOnly
                                    unit='float'
                                    initialRating={movie.rating}
                                    size={window.innerHeight * 0.02}
                                    />
                                <p>{parseSearchTerm(document.getElementById("search-input").value, movie.gerne)}</p>
                                <p>{parseSearchTerm(document.getElementById("search-input").value, movie.director)}</p>
                                <p>{parseSearchTerm(document.getElementById("search-input").value, movie.stars.join(" , "))}</p>
                            </div>
                        </div>
                    ))
                :''}
            </div>
        </div>
    )
}

export default SearchBar;