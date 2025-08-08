import { React, useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/Userauthcontext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import { NotificationPopup } from "./notificationPopus";
import { useTranslation } from "react-i18next";

const Tweetbox = () => {
  const { t } = useTranslation();
  const [Notificationpop, setNotificationPop] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user, notificationEnabled } = useUserAuth();
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
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handletweet = (e) => {
    e.preventDefault();

    const currentPost = post;
    const currentImage = imageurl;

    if (user?.providerData[0]?.providerId === "password") {
      fetch(`https://twitter-ot3r.onrender.com/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    }

    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: currentPost,
        photo: currentImage,
        username: username,
        name: name,
        email: email,
      };

      setpost("");
      setimageurl("");

      fetch("https://twitter-ot3r.onrender.com/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (Notification.permission === "granted" && notificationEnabled) {
            new Notification(t("tweet"), {
              body: currentPost,
            });
          }

          if (
            currentPost.toLowerCase().includes("cricket") ||
            currentPost.toLowerCase().includes("science")
          ) {
            setPopupText(currentPost);
            setNotificationPop(true);
          }
        });
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
            placeholder={t("whatsHappening")}
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>

        <label htmlFor="image" className="imageicon">
          {isloading ? (
            <p>{t("uploading_image")}</p>
          ) : (
            <p>
              {imageurl ? (
                t("image_uploaded")
              ) : (
                <AddPhotoAlternateOutlinedIcon />
              )}
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
          {t("tweet")}
        </Button>

        {Notificationpop && (
          <NotificationPopup
            text={popupText}
            onClose={() => setNotificationPop(false)}
          />
        )}
      </form>
    </div>
  );
};

export default Tweetbox;
