/* eslint-disable react/jsx-no-duplicate-props */
import logo from './logo.svg';
import './style/App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Admin from './components/Admin';
import Movie from './components/Movie';
import ViewProfile from './components/ViewProfile';


const App = () => {
  return (
  <>
    <link
      rel="stylesheet"
      type="text/css"
      charset="UTF-8"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
    <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signin' element={<Signin/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/movie/:id' element={<Movie/>} />
        <Route path='/viewprofile' element={<ViewProfile/>} />
      </Routes>
      <input className='userid' type="hidden"/>
    </Router>
  </>
  );
}

export default App;
