import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import BASE_URL from "../BaseUrl";
import "../style/ViewProfile.css";
import axios from 'axios';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [userInputForm, setUserInputForm] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userInputForm.name,
        image: userInputForm.image,
        dob: userInputForm.dob,
      }),
    };

    fetch(`${BASE_URL}/api/user/update-user/${currentUser._id}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setErrorMessage(res.message);
        } else {
          setCurrentUser(res);
          window.localStorage.setItem("currentUser", JSON.stringify(res));
          setIsSuccess(true);
        }
      });
  };

  const setErrorMessage = (mes) => {
    console.log(mes);
  };

  const uploadImage = async (e) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/api/user/image-upload`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const res = await response.data;
    setUserInputForm({ ...userInputForm, image: res });
  }

  useEffect(() => {
    if (currentUser) {
      setUserInputForm({
        username: currentUser.username,
        name: currentUser.name,
        image: currentUser.image,
      })
    }
  }, [currentUser]);

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
      <h1>Greetings, {userInputForm.username}</h1>
      <div className="profile-image">
          <img src={`${BASE_URL}${userInputForm.image}`} />
          <input id="input-file" type="file" name="file" onChange={uploadImage} style={{display: "none"}}></input>
          <i class="fa fa-edit" onClick={(e) => {
            document.getElementById("input-file").click();
          }}></i>
        </div>
        <div className="profile-detail">
          <div className="inputProfile">
            <label for="name">Full name</label>
            <input
              type="text"
              id="name"
              value={userInputForm.name}
              onChange={handleInputChange}
            />
            <i class="fa fa-edit"></i>
          </div>
          <div className="inputProfile">
            <label for="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={userInputForm.dob}
              onChange={handleInputChange}
            />
            <i class="fa fa-edit"></i>
          </div>
          <div className="btn">
            <button id="save-changes-button" onClick={() => {saveAllChanges()}}>
              Save changes
            </button>
            <button id="cancel_button" onClick={() => {
              setUserInputForm(currentUser);
            }}>
              Cancel
            </button>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
