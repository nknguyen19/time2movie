import React, {useState, useEffect} from 'react';
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../BaseUrl';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';



const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const signin = () => {
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
        fetch(`${BASE_URL}/api/user/signin`, requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    setErrorMessage(res.message);   
                } 
                else {
                    window.localStorage.setItem('currentUser', JSON.stringify(res));
                    navigate(-1);
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
                navigate(-1);
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
        <div className="signin">
            <GoogleOAuthProvider clientId="1068511937331-0qdrv0dc6hb5vq8q7rbqiqvc2sjsgmr2.apps.googleusercontent.com">
            <div className="signin-wrap">
                <div className="signin-form">
                    <h3>Welcome back to</h3>
                    <p>Sign in using your account registered with Time2Movie</p>
                    <span>{errorMessage}</span>
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <div className="signin-btn" onClick={() => signin()}>
                        Sign in
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
                    
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
                <img src="signin-background.jpg" alt="image" />
            </div>
            </GoogleOAuthProvider>
        </div>
    )
}

export default Signin;