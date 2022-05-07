const BASE_URL = process.env.NODE_ENV === window.location.includes("localhost") ? "http://localhost:3001" : "https://sheltered-retreat-14346.herokuapp.com";

export default BASE_URL;