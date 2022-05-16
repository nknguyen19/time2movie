import React, { useState } from "react";
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../BaseUrl";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const createUser = () => {
        if (username.length === 0 || password === 0) { // TODO: handle input error
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username,
                password: password,
            })
        };
        fetch(`${BASE_URL}/api/user/create`, requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    setErrorMessage(res.message);
                }
                else {
                    window.localStorage.setItem('currentUser', JSON.stringify(res));
                    navigate('/');
                }
            });
    }
    
    const loginFacebook = (info) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: info.email,
                password: info.id,
                name: info.name,
                avatar: info.picture.data.url,
                is_facebook_login: true,
            })
        };
        fetch(`${BASE_URL}/api/user/login-facebook`, requestOptions)
            .then(res => res.json())
            .then(res => {
                window.localStorage.setItem('currentUser', JSON.stringify(res));
                navigate('/');
            });
    }

    const loginGoogleSuccess = (info)=>
    {
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credentials: info.credential
        })
    };
        fetch(`${BASE_URL}/api/user/login-google`, requestOptions)
            .then(res=> res.json())
            .then(res => {
                window.localStorage.setItem('currentUser', JSON.stringify(res));
                navigate(-1);
            });

    }
    const loginGoogleError = (info)=>
    {
        console.log(info);
    }

    return (
        <div className="signup">
            <GoogleOAuthProvider clientId="1068511937331-0qdrv0dc6hb5vq8q7rbqiqvc2sjsgmr2.apps.googleusercontent.com">

            <div className="signup-wrap">
                <div className="signup-form">
                    <h3>Sign up</h3>
                    <p>Sign up using your email address or phone number below to get started.</p>
                    <span>{errorMessage}</span>
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <div className="signup-btn" onClick={() => createUser}>
                        Create account
                    </div>
                    <div className="or"><hr/> Or <hr/></div>
                    <div className='facebook-login'>
                        <FacebookLogin 
                            className="facebook-signup"
                            appId="417605773527214"
                            // autoLoad={true}
                            fields="name,email,picture"
                            callback={loginFacebook} />    
                    </div>
                    <div className='google-login'>
                        <GoogleLogin
                            className="google-signin"
                            onSuccess={loginGoogleSuccess}
                            onError = {loginGoogleError}/>            
                    </div>
                    <p>Already have an account?<a href="/signin">Sign in</a></p>
                </div>
                <img src="signup-background.jpg" alt="image" />
            </div>
            </GoogleOAuthProvider>
        </div>
    );
}

export default Signup;