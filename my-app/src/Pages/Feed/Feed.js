import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";

const Feed = () => {
  const { t } = useTranslation(); // for translations
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetch("https://twitter-ot3r.onrender.com/post")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []); // empty array to avoid infinite loop

  return (
    <div className="feed">
      <div className="feed_header">
        <h2>{t("home")}</h2> {/* Translated heading */}
      </div>
      <Tweetbox />
      {post.map((p) => (
        <Posts key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
