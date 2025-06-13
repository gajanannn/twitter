import React from "react";
import "../../Feed/Posts/Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

const Posts = ({ p }) => {
  const { name, username, photo, post, profilephoto } = p;

  return (
    <div className="post">
      <div className="post_avatar">
        <Avatar src={profilephoto} />
      </div>
      <div className="post_body">
        <div className="post_header">
          <div className="post_headerText">
            <h3>
              {name}{" "}
              <span className="post_headerSpecial">
                <VerifiedUserIcon className="post_badge" />@{username}
              </span>
            </h3>
          </div>
          <div className="post_headerDescription">
            <p>{post}</p>
          </div>
        </div>
        <img src={photo} alt="" width="500" />
        <div className="post_footer">
          <ChatBubbleOutlineIcon
            className="post_fotter_icon"
            fontSize="small"
          />
          <RepeatIcon className="post_fotter_icon" fontSize="small" />
          <FavoriteBorderIcon className="post_fotter_icon" fontSize="small" />
          <PublishIcon className="post_fotter_icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;
