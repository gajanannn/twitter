import React, { useState, useEffect } from "react";
import Posts from "../Posts/Posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setloading] = useState(false);
  const loggedinuser = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);

  useEffect(() => {
    fetch(`https://twitter-ot3r.onrender.com/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4157850e55dd16ea1a2b011d996a67e5",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        setloading(false);
        if (url) {
          fetch(`https://twitter-ot3r.onrender.com/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setloading(false);
      });
  };
  const handleuploadprofileimage = (e) => {
    setloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4157850e55dd16ea1a2b011d996a67e5",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setloading(false);
        if (url) {
          fetch(`https://twitter-ot3r.onrender.com/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setloading(false);
      });
  };
  return (
    <div className="page">
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          {/* { */}
          <div>
            <div className="covereImageContainer">
              <img
                src={
                  loggedinuser[0]?.coverimage
                    ? loggedinuser[0].coverimage
                    : user && user.photoURL
                }
                alt=""
                className="coverImage"
              />
              <div className="">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>
            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedinuser[0]?.profileImage
                      ? loggedinuser[0]?.profileImage
                      : user && user.photoURL
                  }
                  alt=""
                  className="avatar"
                />
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="imageInput"
                      onChange={handleuploadprofileimage}
                    />
                    <div className="userInfo">
                      <div>
                        <h3 className="heading_3">
                          {loggedinuser[0]?.name || user?.displayName || "User"}
                        </h3>
                        <p className="usernameSection">@{username}</p>
                      </div>
                      <Editprofile user={user} loggedinuser={loggedinuser} />
                    </div>
                    <div className="infoContainer">
                      {loggedinuser[0]?.bio ? <p>{loggedinuser[0].bio}</p> : ""}
                      <div className="locatioAndLink">
                        {loggedinuser[0]?.location ? (
                          <p className="suvInfo">
                            <MyLocationIcon /> {loggedinuser[0].location}
                          </p>
                        ) : (
                          ""
                        )}
                        {loggedinuser[0]?.website ? (
                          <p className="subinfo link">
                            <AddLinkIcon />
                            {loggedinuser[0].website}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* <h4 className="tweetsText">Tweets</h4> */}
                    <hr />
                  </div>
                  {post.map((p) => (
                    <Posts p={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* } */}
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
