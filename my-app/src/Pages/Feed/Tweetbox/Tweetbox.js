import { React, useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/Userauthcontext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import { Form } from "react-router-dom";

const Tweetbox = () => {
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user } = useUserAuth();
  const [loggedinuser] = useLoggedinuser();
  const email = user?.email;
  const userprofilepic = loggedinuser[0]?.profileImage
    ? loggedinuser[0].profileImage
    : user && user.photoURL;
  const handuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4157850e55dd16ea1a2b011d996a67e5",
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        console.log(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handletweet = (e) => {
    e.preventDefault();
    if (user?.provideData[0]?.providerId === "password") {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
          // setloggedinuser(data);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    }
    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        photo: imageurl,
        username: username,
        name: name,
        email: email,
      };
      setpost("");
      setimageurl("");
      fetch("http://localhost:5000/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  };

  return (
    <div className="tweetbox">
      <form onSubmit={handletweet}>
        <div className="tweetbBox_input">
          <Avatar
            src={
              loggedinuser[0]?.profileImage
                ? loggedinuser[0].profileImage
                : user && user.photoURL
            }
          />
          <input
            type="text"
            placeholder="Whats Happening"
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>
        <label htmlFor="image" className="imageicon">
          {isloading ? (
            <p>Uploading image</p>
          ) : (
            <p>
              {" "}
              {imageurl ? "Image uploaded" : <AddPhotoAlternateOutlinedIcon />}
            </p>
          )}
        </label>
        <input
          type="file"
          id="image"
          className="imageInput"
          onChange={handuploadimage}
        />
        <Button className="tweetBox_tweetButton" type="submit">
          Tweet
        </Button>
      </form>
    </div>
  );
};

export default Tweetbox;
