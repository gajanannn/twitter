//

import React, { useEffect, useState } from "react";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";

const Feed = () => {
  const [post, setPost] = useState([]);

  const fetchPosts = () => {
    fetch("https://twitter-ot3r.onrender.com/post")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  useEffect(() => {
    fetchPosts(); // initial fetch
    const intervalId = setInterval(fetchPosts, 3000); // fetch every 3s
    return () => clearInterval(intervalId); // cleanup
  }, []);

  return (
    <div className="feed">
      <div className="feed_header">
        <h2>Home</h2>
      </div>
      <Tweetbox />
      {post.map((p) => (
        <Posts key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
