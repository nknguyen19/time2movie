import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../BaseUrl";
import SearchBar from "./SeachBar";

const TopBar = (props) => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

    return (
        <div className="top-bar">
            <div className="logo"
                onClick={() => {navigate('/')}}>
                Time2Movie
            </div>
            
            <SearchBar />
            
            {props.currentUser ? 
            <div className="welcome">
                <img src={`${BASE_URL}${props.currentUser.image}`}/>
                <div className="welcome-text">
                    <p>Welcome!  </p> 
                    <p>  {props.currentUser.name}</p>
                </div>
                {/* {props.currentUser.isAdmin ? 
                    <span onClick={() => navigate('/admin')}>Admin</span> 
                : ''} */}
                <div className="user-menu">
                    <i class="fa fa-bars" aria-hidden="true" onClick={() => setMenu(!menu)}></i>
                    <div className="menu" style={{
                        display: menu? 'block' : 'none'
                    }}>
                        <div className="logout">
                            <i class="fa fa-sign-out"></i>
                            <p>Sign out</p>
                        </div>
                        <div className="profile">
                            <i class="fa fa-user" aria-hidden="true"></i>
                            <p>Profile</p>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="auth">
                <button onClick={() => {navigate('/signup')}}>Sign up</button>
                <button onClick={() => {navigate('/signin')}}>Sign in</button>
            </div>
}
        </div>
    )
}

export default TopBar;