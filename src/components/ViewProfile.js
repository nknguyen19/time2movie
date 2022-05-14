import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import BASE_URL from "../BaseUrl";
import "../style/ViewProfile.css";

const ViewProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [userInputForm, setUserInputForm] = useState({
    name: "",
    username: "",
    password: "",
    dob: "",
  });

  const fetchUser = async () => {
    setCurrentUser(JSON.parse(window.localStorage.getItem("currentUser")));
  };

  const handleInputChange = (e) => {
    let target = e.target;
    let id = target.id;
    let value = target.value;

    setUserInputForm({
      ...userInputForm,
      [id]: value,
    });
  };

  const saveAllChanges = async () => {
    if (userInputForm.name === "") {
      userInputForm.name = currentUser.name;
    }
    if (userInputForm.password === "") {
      userInputForm.password = currentUser.password;
    }
    if (userInputForm.dob === "") {
      userInputForm.dob = currentUser.dob;
    }
    const requestOptions = await {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userInputForm.username,
        password: userInputForm.password,
        dob: userInputForm.dob,
        name: userInputForm.name,
        original: currentUser.username,
      }),
    };
    console.log(requestOptions.body);
    fetch(`${BASE_URL}/api/user/save-changes`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.message) {
          setErrorMessage(res.message);
        } else {
          window.localStorage.setItem("currentUser", JSON.stringify(res));
        }
      });
  };
  const setErrorMessage = (mes) => {
    console.log(mes);
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
    setLoading(false);
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="view-profile">
      <TopBar currentUser={currentUser} />
      <div className="profile">
        <div className="profile-image">
          <img src={`${BASE_URL}${currentUser.image}`} />
            <h1>{currentUser.name}</h1>
            <p>{currentUser.username}</p>
        </div>
        <div className="profile-detail">
          <div className="inputProfile">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              value={userInputForm.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="inputProfile">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              value={userInputForm.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="inputProfile">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={userInputForm.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="inputProfile">
            <label for="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={userInputForm.dob}
              onChange={handleInputChange}
            />
          </div>
          <button id="save-changes-button" onClick={saveAllChanges}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
